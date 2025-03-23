import json
import boto3
import pandas as pd
import openpyxl
import os
from io import BytesIO

# Initialize S3 client
s3 = boto3.client("s3")

# Get environment variables
BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
FILE_NAME = os.getenv("S3_FILE_NAME")

def add_cors_headers(response, origin):
    """Add CORS headers to the response"""
    response["headers"] = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
    }
    return response

def create_response(status_code, body, origin=None):
    """Create a response with CORS headers"""
    return add_cors_headers({
        "statusCode": status_code,
        "body": json.dumps(body)
    }, origin)

def lambda_handler(event, context):
    # Get the origin from the request headers
    origin = event.get("headers", {}).get("origin", "http://localhost:3000")
    
    # Handle preflight requests
    if event.get("httpMethod") == "OPTIONS":
        return create_response(200, {"message": "Preflight call successful"}, origin)

    try:
        # Parse request body
        body = json.loads(event.get("body", "{}"))

        if not isinstance(body, dict):
            return create_response(400, {
                "message": "Invalid input format. Expected JSON object."
            }, origin)

        # Convert all keys to lowercase for case-insensitive comparison
        normalized_keys = set(map(str.lower, body.keys()))
        if "email" not in normalized_keys or "name" not in normalized_keys:
            return create_response(400, {
                "message": "Email and Name are required!"
            }, origin)

        # Convert all keys to lowercase
        normalized_body = {k.lower(): v for k, v in body.items()}

        # Add timestamp if not present
        if "timestamp" not in normalized_body:
            normalized_body["timestamp"] = pd.Timestamp.now().isoformat()

        # Convert JSON to DataFrame
        new_data = pd.DataFrame([normalized_body])

        try:
            # Check if file exists in S3
            try:
                response = s3.get_object(Bucket=BUCKET_NAME, Key=FILE_NAME)
                body_stream = response["Body"].read()

                if not body_stream:
                    existing_data = pd.DataFrame()
                else:
                    existing_data = pd.read_excel(BytesIO(body_stream), engine="openpyxl")

                    # Convert existing column names to lowercase
                    existing_data.columns = existing_data.columns.str.lower()

            except s3.exceptions.NoSuchKey:
                existing_data = pd.DataFrame()

            # Merge old and new data
            updated_data = pd.concat([existing_data, new_data], ignore_index=True, sort=False).fillna("")

            # Drop duplicate columns (if any)
            updated_data = updated_data.loc[:, ~updated_data.columns.duplicated()]

            # Convert to Excel
            excel_buffer = BytesIO()
            with pd.ExcelWriter(excel_buffer, engine="openpyxl") as writer:
                updated_data.to_excel(writer, index=False)

            # Upload updated file to S3
            s3.put_object(
                Bucket=BUCKET_NAME,
                Key=FILE_NAME,
                Body=excel_buffer.getvalue(),
                ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )

            return create_response(200, {
                "message": "Data appended successfully!",
                "rowCount": len(updated_data)
            }, origin)

        except Exception as e:
            print(f"Error processing data: {str(e)}")
            return create_response(500, {
                "message": "Error processing data",
                "error": str(e)
            }, origin)

    except json.JSONDecodeError as e:
        return create_response(400, {
            "message": "Invalid JSON in request body",
            "error": str(e)
        }, origin)
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return create_response(500, {
            "message": "Internal server error",
            "error": str(e)
        }, origin) 
import json
import os
import requests
from base64 import b64encode

# Get API key from environment variable
ULTRAVOX_API_KEY = os.getenv("ULTRAVOX_API_KEY")

def add_cors_headers(response):
    """Add CORS headers to the response"""
    response["headers"] = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json"
    }
    return response

def create_response(status_code, body):
    """Create a response with CORS headers"""
    return add_cors_headers({
        "statusCode": status_code,
        "body": json.dumps(body)
    })

def lambda_handler(event, context):
    # Handle preflight requests
    if event.get("httpMethod") == "OPTIONS":
        return create_response(200, {"message": "Preflight call successful"})

    try:
        # Get call_id from query parameters
        query_params = event.get("queryStringParameters", {})
        if not query_params or "callId" not in query_params:
            return create_response(400, {
                "message": "callId is required as a query parameter"
            })

        call_id = query_params["callId"]

        # Make request to Ultravox API
        url = f"https://api.ultravox.ai/api/calls/{call_id}/recording"
        headers = {"X-API-Key": ULTRAVOX_API_KEY}

        response = requests.get(url, headers=headers)

        if not response.ok:
            return create_response(response.status_code, {
                "message": "Failed to fetch recording",
                "error": response.text
            })

        # Get the audio content and encode it as base64
        audio_content = response.content
        audio_base64 = b64encode(audio_content).decode('utf-8')

        return create_response(200, {
            "message": "Recording fetched successfully",
            "audioData": audio_base64,
            "contentType": response.headers.get("Content-Type", "audio/wav")
        })

    except Exception as e:
        print(f"Error fetching recording: {str(e)}")
        return create_response(500, {
            "message": "Internal server error",
            "error": str(e)
        }) 
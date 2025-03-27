export type Industry = "Insurance" | "Healthcare" | "Aviation" | "E-commerce" | "Custom";

export interface Transcript {
  text: string;
  timestamp: string;
  isUser: boolean;
}

export interface CallState {
  isActive: boolean;
  agentName: string;
  transcripts: Transcript[];
  audioUrl?: string;
} 
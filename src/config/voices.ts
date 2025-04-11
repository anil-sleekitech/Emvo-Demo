
export const voices = [
  { 
    id: "9f6262e3-1b03-4a0b-9921-50b9cff66a43", 
    label: "Krishna-Hindi-IndianEnglish", 
    introduction: "I am Krishna, an AI assistant fluent in Hindi and Urdu."
  },
  { 
    id: "d17917ec-fd98-4c50-8c83-052c575cbf3e", 
    label: "Riya-Hindi-IndianEnglish", 
    introduction: "I am Riya, an AI assistant fluent in Hindi and Urdu."
  },
  { 
    id: "ebae2397-0ba1-4222-9d5b-5313ddeb04b5", 
    label: "Anjali-Hindi-IndianEnglish", 
    introduction: "I am Anjali, an AI assistant fluent in Hindi and Urdu."
  },
  { 
    id: "82c9728c-e0fe-4bc2-b7a3-03bb271fafb9", 
    label: "Aakash-Hindi-IndianEnglish", 
    introduction: "I am Aakash, an AI assistant fluent in Hindi and Urdu."
  },
]; 

// Helper function to add voice introduction to a prompt
export const addVoiceIntro = (prompt: string, voiceId: string, agentTitle?: string): string => {
  const voice = voices.find(v => v.id === voiceId);
  if (!voice) return prompt;
  
  // Extract the name part from the voice label
  const voiceName = voice.label.split('-')[0];
  
  // Replace [AI Agent Name] with the actual voice name
  let promptWithName = prompt.replace(/\[AI Agent Name\]/g, voiceName);
  
  // Add agent title if provided
  if (agentTitle) {
    promptWithName = promptWithName.replace(/\[Agent Role\]/g, agentTitle);
  }
  
  return `${voice.introduction}\n\nYou are ${voiceName}, a ${agentTitle || "helpful assistant"}.\n\n${promptWithName}`;
}; 

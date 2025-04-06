export const voices = [
  { 
    id: "e6fce4ac-da54-43e9-8fb2-66de86f72a5b", 
    label: "Richard-English", 
    introduction: "I am Richard, an AI assistant fluent in English."
  },
  { 
    id: "9f6262e3-1b03-4a0b-9921-50b9cff66a43", 
    label: "Krishna-Hindi-IndianEnglish", 
    introduction: "I am Krishna, an AI assistant fluent in Hindi and Urdu."
  },
  { 
    id: "c2c5cce4-72ec-4d8b-8cdb-f8a0f6610bd1", 
    label: "Riya-Hindi-IndianEnglish", 
    introduction: "I am Riya, an AI assistant fluent in Hindi and Urdu."
  },
  { 
    id: "ebae2397-0ba1-4222-9d5b-5313ddeb04b5", 
    label: "Anjali-Hindi-IndianEnglish", 
    introduction: "I am Anjali, an AI assistant fluent in Hindi and Urdu."
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
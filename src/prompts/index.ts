// Insurance prompts
import { insurancePrompts } from './insurance';
import { healthcarePrompts } from './healthcare';
import { aviationPrompts } from './aviation';
import { miscellaneousPrompts } from './miscellaneous';
import { voices, addVoiceIntro } from "../config/voices";
// Import other prompts as needed

// Helper function to add voice introduction to a prompt
const addVoiceIntro = (prompt: string, voiceId: string, agentTitle?: string): string => {
  const voice = voices.find(v => v.id === voiceId);
  if (!voice) return prompt;
  
  // Extract the name part from the voice label (e.g., "Richard" from "Richard-English")
  const voiceName = voice.label.split('-')[0];
  
  // Replace [AI Agent Name] with the actual voice name
  let promptWithName = prompt.replace(/\[AI Agent Name\]/g, voiceName);
  
  // Add agent title if provided
  if (agentTitle) {
    promptWithName = promptWithName.replace(/\[Agent Role\]/g, agentTitle);
  }
  
  return `${voice.introduction}\n\n${promptWithName}`;
};

// Custom prompts handler
const customPrompts = {
  customPrompt: (voiceId: string, agentTitle?: string, customPrompt?: string) => {
    if (!customPrompt) {
      return addVoiceIntro("You are a helpful AI assistant.", voiceId, agentTitle);
    }
    
    return addVoiceIntro(customPrompt, voiceId, agentTitle);
  }
};

// Export all prompts
export const prompts = {
  insurance: insurancePrompts,
  healthcare: healthcarePrompts,
  aviation: aviationPrompts,
  miscellaneous: miscellaneousPrompts,
  custom: customPrompts
}; 
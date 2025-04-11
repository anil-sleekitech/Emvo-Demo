
// Insurance prompts
import { insurancePrompts } from './insurance';
import { healthcarePrompts } from './healthcare';
import { aviationPrompts } from './aviation';
import { miscellaneousPrompts } from './miscellaneous';
import { voices } from "../config/voices";

// Helper function to add voice introduction to a prompt
const addVoiceIntro = (prompt: string, voiceId: string, agentTitle?: string): string => {
  const voice = voices.find(v => v.id === voiceId);
  if (!voice) return prompt;
  
  // Extract the name part from the voice label (e.g., "Krishna" from "Krishna-Hindi-IndianEnglish")
  const voiceName = voice.label.split('-')[0];
  
  // Replace [AI Agent Name] with the actual voice name
  let promptWithName = prompt.replace(/\[AI Agent Name\]/g, voiceName);
  
  // Add agent title if provided
  if (agentTitle) {
    promptWithName = promptWithName.replace(/\[Agent Role\]/g, agentTitle);
  }
  
  return `${voice.introduction}\n\nYou are ${voiceName}, a ${agentTitle || "helpful assistant"}.\n\n${promptWithName}`;
};

// Custom prompts handler
const customPrompts = {
  customPrompt: (voiceId: string, agentTitle?: string, customPrompt?: string) => {
    if (!customPrompt) {
      return addVoiceIntro("You are a helpful AI assistant named [AI Agent Name].", voiceId, agentTitle);
    }
    
    // Make sure to replace any instances of [AI Agent Name] in the custom prompt
    const customPromptWithVoice = customPrompt.includes("[AI Agent Name]") ? 
      customPrompt : 
      `You are [AI Agent Name], a ${agentTitle || "helpful assistant"}.\n\n${customPrompt}`;
    
    return addVoiceIntro(customPromptWithVoice, voiceId, agentTitle);
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

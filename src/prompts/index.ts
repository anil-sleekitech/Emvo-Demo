// Insurance prompts
import { insurancePrompts } from './insurance';
import { healthcarePrompts } from './healthcare';
import { aviationPrompts } from './aviation';
import { voices } from "../config/voices";
// Import other prompts as needed

// Helper function to add voice introduction to a prompt
const addVoiceIntro = (prompt: string, voiceId: string): string => {
  const voice = voices.find(v => v.id === voiceId);
  if (!voice) return prompt;
  
  // Extract the name part from the voice label (e.g., "Richard" from "Richard-English")
  const voiceName = voice.label.split('-')[0];
  
  // Replace [AI Agent Name] with the actual voice name
  const promptWithName = prompt.replace(/\[AI Agent Name\]/g, voiceName);
  
  return `${voice.introduction}\n\n${promptWithName}`;
};

// Custom prompts handler
const customPrompts = {
  customPrompt: (voiceId: string, customPrompt?: string) => {
    if (!customPrompt) {
      return addVoiceIntro("You are a helpful AI assistant.", voiceId);
    }
    
    // Replace [AI Agent Name] with the actual voice name in the custom prompt
    const voice = voices.find(v => v.id === voiceId);
    if (!voice) return customPrompt;
    
    const voiceName = voice.label.split('-')[0];
    const promptWithName = customPrompt.replace(/\[AI Agent Name\]/g, voiceName);
    
    return `${voice.introduction}\n\n${promptWithName}`;
  }
};

// Export all prompts
export const prompts = {
  insurance: insurancePrompts,
  healthcare: healthcarePrompts,
  aviation: aviationPrompts,
  custom: customPrompts
}; 
// Insurance prompts
import { insurancePrompts } from './insurance';
import { healthcarePrompts } from './healthcare';
import { aviationPrompts } from './aviation';
// Import other prompts as needed

// Custom prompts handler
const customPrompts = {
  customPrompt: (voiceId: string) => {
    // This will be overridden by the direct input from the textarea
    return "";
  }
};

// Export all prompts
export const prompts = {
  insurance: insurancePrompts,
  healthcare: healthcarePrompts,
  aviation: aviationPrompts,
  custom: customPrompts
}; 
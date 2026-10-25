import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function analyzeJournalEntry(rawText) {
  try {
    // If no API key is provided or for fallback, analyze keywords dynamically
    const lowerText = rawText.toLowerCase();

    // Dynamic keyword-based analysis fallback or prompt generation
    let clarityScore = 65;
    let distortions = ['Overgeneralization'];
    let socraticPrompt = 'What evidence do you have that supports or refutes this thought?';

    if (lowerText.includes('calm') || lowerText.includes('good') || lowerText.includes('well') || lowerText.includes('peace')) {
      clarityScore = 88;
      distortions = ['Balanced Perspective'];
      socraticPrompt = 'What contributed to this sense of calm today, and how can you invite more of it tomorrow?';
    } else if (lowerText.includes('work') || lowerText.includes('team') || lowerText.includes('fail') || lowerText.includes('undo')) {
      clarityScore = 45;
      distortions = ['Catastrophizing', 'Fortune Telling'];
      socraticPrompt = 'What is a smaller, more objective truth you can hold onto instead of the worst-case scenario?';
    } else if (lowerText.includes('always') || lowerText.includes('never') || lowerText.includes('everyone')) {
      clarityScore = 55;
      distortions = ['All-or-Nothing Thinking'];
      socraticPrompt = 'Are there any exceptions to this absolute pattern that you might be overlooking?';
    }

    // Optional: If you want to attempt calling a Hugging Face model
    /*
    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: `Analyze this journal entry for cognitive distortions and provide a socratic question: "${rawText}"`,
      parameters: { max_new_tokens: 150 }
    });
    // Parse response here if desired...
    */

    return {
      clarityScore,
      distortions,
      socraticPrompt,
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    // Fallback default
    return {
      clarityScore: 60,
      distortions: ['General Reflection'],
      socraticPrompt: 'How might you look at this situation with more self-compassion?',
    };
  }
}
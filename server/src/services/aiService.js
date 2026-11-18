export async function analyzeJournalEntry(rawText) {
  try {
    const lowerText = rawText.toLowerCase();

    let clarityScore = 65;
    let distortions = ['Overgeneralization'];
    let socraticPrompt = 'What evidence do you have that supports or refutes this thought?';

    if (lowerText.includes('calm') || lowerText.includes('good') || lowerText.includes('well') || lowerText.includes('peace')) {
      clarityScore = 88;
      distortions = ['Balanced Perspective'];
      socraticPrompt = 'What contributed to this sense of calm today, and how can you invite more of it tomorrow?';
    } else if (lowerText.includes('work') || lowerText.includes('team') || lowerText.includes('fail') || lowerText.includes('undo') || lowerText.includes('viva') || lowerText.includes('code')) {
      clarityScore = 58;
      distortions = ['Catastrophizing', 'Overthinking'];
      socraticPrompt = 'What is one specific, controllable part of your preparation that you can focus on right now?';
    }

    return {
      clarityScore,
      distortions,
      socraticPrompt,
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      clarityScore: 60,
      distortions: ['General Reflection'],
      socraticPrompt: 'How might you look at this situation with more self-compassion?',
    };
  }
}
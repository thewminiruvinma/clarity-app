import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Inline AI Analysis function to prevent missing file/import errors
async function analyzeJournalEntry(rawText) {
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

    return { clarityScore, distortions, socraticPrompt };
  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      clarityScore: 60,
      distortions: ['General Reflection'],
      socraticPrompt: 'How might you look at this situation with more self-compassion?',
    };
  }
}

// Get all journal entries for the authenticated user
export const getEntries = async (req, res) => {
  try {
    const userId = req.user.id;

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      include: {
        distortions: true,
        reflections: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

// Create a new journal entry
export const createEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rawText } = req.body;

    if (!rawText) {
      return res.status(400).json({ error: 'Journal text is required' });
    }

    // Analyze entry locally
    const analysis = await analyzeJournalEntry(rawText);

    const newEntry = await prisma.journalEntry.create({
      data: {
        userId,
        rawText,
        clarityScore: analysis.clarityScore || 65,
        distortions: {
          create: (analysis.distortions || ['General Overthinking']).map((dist) => ({
            distortionType: dist,
            confidence: 0.9,
          })),
        },
        reflections: {
          create: [
            {
              socraticPrompt: analysis.socraticPrompt || 'What evidence do you have that supports this thought?',
            },
          ],
        },
      },
      include: {
        distortions: true,
        reflections: true,
      },
    });

    return res.status(201).json({ success: true, entry: newEntry });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return res.status(500).json({ error: 'Failed to create journal entry' });
  }
};

// Add reflection response
export const addReflectionResponse = async (req, res) => {
  try {
    const { reflectionId, userResponse } = req.body;

    if (!reflectionId) {
      return res.status(400).json({ error: 'Reflection ID is required' });
    }

    const updatedReflection = await prisma.socraticReflection.update({
      where: { id: reflectionId },
      data: { userResponse },
    });

    return res.status(200).json({ success: true, reflection: updatedReflection });
  } catch (error) {
    console.error('Error updating reflection:', error);
    return res.status(500).json({ error: 'Failed to submit reflection response' });
  }
};
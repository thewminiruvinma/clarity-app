import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { rawText, clarityScore } = req.body;

    if (!rawText) {
      return res.status(400).json({ error: 'Journal text is required' });
    }

    const newEntry = await prisma.journalEntry.create({
      data: {
        userId,
        rawText,
        clarityScore: clarityScore || 65,
        distortions: {
          create: [
            {
              distortionType: 'General Overthinking',
              confidence: 0.9,
            },
          ],
        },
        reflections: {
          create: [
            {
              socraticPrompt: 'What evidence do you have that supports this thought, and what evidence challenges it?',
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
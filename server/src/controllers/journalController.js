import { PrismaClient } from '@prisma/client';
import { analyzeJournalEntry } from '../services/aiService.js';

const prisma = new PrismaClient();

// Helper to ensure a user record exists in MySQL before attaching entries
async function getOrCreateUser(userId) {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: 'maya@example.com',
        password: 'hashed_password_placeholder',
        name: 'Maya Chen',
      },
    });
  }
  return user;
}

export const getEntries = async (req, res) => {
  try {
    const userId = req.user?.id || 'dev-user-id';
    await getOrCreateUser(userId);

    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      include: {
        distortions: true,
        reflections: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

export const createEntry = async (req, res) => {
  try {
    const { rawText } = req.body;
    const userId = req.user?.id || 'dev-user-id';

    if (!rawText) {
      return res.status(400).json({ error: 'Journal text is required' });
    }

    await getOrCreateUser(userId);

    // Call Hugging Face AI service
    const aiResult = await analyzeJournalEntry(rawText);

    // Create entry in MySQL with nested relations
    const newEntry = await prisma.journalEntry.create({
      data: {
        userId,
        rawText,
        clarityScore: aiResult.clarityScore,
        distortions: {
          create: aiResult.distortions.map((d) => ({ distortionType: d })),
        },
        reflections: {
          create: [{ socraticPrompt: aiResult.socraticPrompt }],
        },
      },
      include: {
        distortions: true,
        reflections: true,
      },
    });

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to save entry' });
  }
};

export const addReflectionResponse = async (req, res) => {
  try {
    const { reflectionId, userResponse } = req.body;

    if (!reflectionId || !userResponse) {
      return res.status(400).json({ error: 'Reflection ID and user response are required' });
    }

    const updatedReflection = await prisma.socraticReflection.update({
      where: { id: reflectionId },
      data: { userResponse },
    });

    res.json(updatedReflection);
  } catch (error) {
    console.error('Error updating reflection response:', error);
    res.status(500).json({ error: 'Failed to record reflection response' });
  }
};
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get growth analytics and trends for the authenticated user
export const getGrowthAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all journal entries for the current user, including distortions and reflections
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      include: {
        distortions: true,
        socraticReflections: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate overall statistics
    const totalEntries = entries.length;
    const avgClarityScore = totalEntries > 0
      ? Math.round(entries.reduce((sum, entry) => sum + (entry.clarityScore || 0), 0) / totalEntries)
      : 0;

    // Aggregate cognitive distortions frequency
    const distortionCounts = {};
    entries.forEach(entry => {
        if (entry.distortions) {
            entry.distortions.forEach(d => {
            const type = d.distortionType || 'Unknown'; // මෙහි d.name වෙනුවට d.distortionType විය යුතුය
            distortionCounts[type] = (distortionCounts[type] || 0) + 1;
            });
        }
        });

    // Format distortion analytics for charts/ui
    const topDistortions = Object.keys(distortionCounts)
      .map(key => ({ name: key, count: distortionCounts[key] }))
      .sort((a, b) => b.count - a.count);

    // Format clarity score history for timeline charts
    const clarityTimeline = entries.map(entry => ({
      date: entry.createdAt,
      clarityScore: entry.clarityScore,
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalEntries,
        avgClarityScore,
      },
      topDistortions,
      clarityTimeline,
      entries,
    });
  } catch (error) {
    console.error('Error fetching growth analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch growth analytics' });
  }
};
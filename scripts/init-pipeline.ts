import { prisma } from '@/lib/prisma';

const defaultStages = [
  { name: 'New Lead', color: '#6B7280', order: 0, isDefault: true },
  { name: 'Contacted', color: '#3B82F6', order: 1, isDefault: false },
  { name: 'No Answer', color: '#F59E0B', order: 2, isDefault: false },
  { name: 'Not Interested', color: '#EF4444', order: 3, isDefault: false },
  { name: 'Trial Booked', color: '#8B5CF6', order: 4, isDefault: false },
  { name: 'Active Member', color: '#10B981', order: 5, isDefault: false },
];

async function initializePipeline() {
  try {
    console.log('Initializing pipeline stages for existing gyms...');

    // Get all gyms
    const gyms = await prisma.gym.findMany();

    for (const gym of gyms) {
      // Check if gym already has stages
      const existingStages = await prisma.pipelineStage.findMany({
        where: { gymId: gym.id },
      });

      if (existingStages.length === 0) {
        console.log(`Creating default stages for gym: ${gym.name}`);

        // Create default stages
        await prisma.pipelineStage.createMany({
          data: defaultStages.map((stage) => ({
            ...stage,
            gymId: gym.id,
          })),
        });

        // Get the default stage
        const defaultStage = await prisma.pipelineStage.findFirst({
          where: { gymId: gym.id, isDefault: true },
        });

        if (defaultStage) {
          // Update all members without a stage to use the default stage
          await prisma.member.updateMany({
            where: { gymId: gym.id, stageId: null },
            data: { stageId: defaultStage.id },
          });
        }

        console.log(`✓ Initialized pipeline for gym: ${gym.name}`);
      } else {
        console.log(`✓ Gym ${gym.name} already has pipeline stages`);
      }
    }

    console.log('Pipeline initialization complete!');
  } catch (error) {
    console.error('Error initializing pipeline:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializePipeline();

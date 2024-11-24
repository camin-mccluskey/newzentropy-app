import { z } from 'zod'

export const storySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  url: z.string().url(),
  // imageUrl: z.string().url(),
  tags: z.array(z.string().min(1)),
  source: z.string().min(1),
  publishedAt: z.string().datetime(),
  embedding: z.array(z.number()),
  leastSimilarStoryIds: z.array(z.string().min(1)),
})

export type Story = z.infer<typeof storySchema>

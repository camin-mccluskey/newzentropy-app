import { z } from 'zod'

export const storySchema = z.object({
  uuid: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  // image_url: z.string().url(),
  tags: z.array(z.string().min(1)),
  source: z.string().min(1),
  published_at: z.string().datetime(),
  embedding: z.array(z.number()),
  least_similar_articles: z.array(
    z.object({
      uuid: z.string().min(1),
      similarity: z.number(),
    }),
  ),
})

export type Story = z.infer<typeof storySchema>


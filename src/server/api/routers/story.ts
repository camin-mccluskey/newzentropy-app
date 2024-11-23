import { z } from 'zod'
import { Mode } from '~/lib/hooks/useStorage'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const storyRouter = createTRPCRouter({
  getStory: publicProcedure
    .input(
      z.object({
        compressedEmbedding: z.string().min(1),
        history: z.array(z.string()),
        mode: z.nativeEnum(Mode),
        lastTopics: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { mode } = input
      const embedding = decompressVector(input.compressedEmbedding)
      // let stories: ScoredPineconeRecord<RecordMetadata>[]
      switch (mode) {
        case Mode.PLACATE:
          return await ctx.vectorDb.getSimilarStory(embedding, input.history)
        case Mode.SURPRISE:
          return await ctx.vectorDb.getSemiSimilarStory(embedding, input.lastTopics, input.history)
        case Mode.CHALLENGE:
          return await ctx.vectorDb.getDissimilarStory(embedding, input.history)
        default:
          return mode satisfies never
      }
    }),
})

// Server-side embedding decoding
const decompressVector = (compressed: string) => {
  // Decode and convert back to array
  const vectorString = decodeURIComponent(atob(compressed))
  return vectorString.split(',').map(Number)
}

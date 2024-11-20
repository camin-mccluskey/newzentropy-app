import { type RecordMetadata, type ScoredPineconeRecord } from '@pinecone-database/pinecone'
import { z } from 'zod'
import { type Story } from '~/app/data/types'
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
      const embedding = decompressVector(input.compressedEmbedding)
      let stories: ScoredPineconeRecord<RecordMetadata>[]
      if (input.mode === Mode.PLACATE) {
        stories = await ctx.vectorDb.getSimilarStories(embedding).then((res) => res.matches)
      } else if (input.mode === Mode.SURPRISE) {
        stories = await ctx.vectorDb
          .getSemiSimilarStories(embedding, input.lastTopics)
          .then((res) => res.matches)
      } else {
        stories = await ctx.vectorDb.getDissimilarStories(embedding).then((res) => res.matches)
      }
      const selectedStory = stories.filter((story) => !input.history.includes(story.id))[0]
      if (!selectedStory) {
        return null
      }
      return {
        uuid: selectedStory.id,
        embedding: selectedStory.values,
        ...selectedStory.metadata,
      } as Story
    }),
})

// Server-side decoding
const decompressVector = (compressed: string) => {
  // Decode and convert back to array
  const vectorString = decodeURIComponent(atob(compressed))
  return vectorString.split(',').map(Number)
}

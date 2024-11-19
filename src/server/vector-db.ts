import { Pinecone } from '@pinecone-database/pinecone'
import { env } from '~/env'

const pc = new Pinecone({ apiKey: env.PINECONE_API_KEY })
const storiesIndex = pc.index('stories', env.STORIES_INDEX_HOST)
const inverseStoriesIndex = pc.index('inverse-stories', env.INVERSE_STORIES_INDEX_HOST)

export const vectorDb = {
  getSimilarStories: async (embedding: number[]) => {
    // TODO: validate w/ zod
    return await storiesIndex.query({
      vector: embedding,
      topK: 5,
      includeValues: true,
      includeMetadata: true,
    })
  },
  getDissimilarStories: async (embedding: number[]) => {
    return await inverseStoriesIndex.query({
      vector: embedding,
      topK: 5,
      includeValues: true,
      includeMetadata: true,
    })
  },
  getSemiSimilarStories: async (embedding: number[], lastTopics: string[]) => {
    return await inverseStoriesIndex.query({
      vector: embedding,
      topK: 5,
      includeValues: true,
      includeMetadata: true,
      filter: {
        tags: { $in: lastTopics },
      },
    })
  },
}

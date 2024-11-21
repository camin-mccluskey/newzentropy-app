import { Pinecone } from '@pinecone-database/pinecone'
import { env } from '~/env'

const pc = new Pinecone({ apiKey: env.PINECONE_API_KEY })
const storiesIndex = pc.index('stories', env.STORIES_INDEX_HOST)
const inverseStoriesIndex = pc.index('inverse-stories', env.INVERSE_STORIES_INDEX_HOST)

const excludedStoryFilter = (excludedStoryIds: string[]) => {
  return {
    id: { $nin: excludedStoryIds },
  }
}

export const vectorDb = {
  getSimilarStory: async (embedding: number[], excludedStoryIds: string[]) => {
    // TODO: validate w/ zod
    return await storiesIndex
      .query({
        vector: embedding,
        topK: 1,
        includeValues: true,
        includeMetadata: true,
        filter: excludedStoryFilter(excludedStoryIds),
      })
      .then((res) => res.matches[0])
  },
  getDissimilarStory: async (embedding: number[], excludedStoryIds: string[]) => {
    const mostSimilarStory = await vectorDb.getSimilarStory(embedding, excludedStoryIds)
    if (!mostSimilarStory) {
      return
    }
    // get least similar story from lookup
    // TODO: shold invert this naming convention
    const leastSimilarStoryId = (
      mostSimilarStory.metadata?.similar_articles as Array<{ uuid: string }>
    )?.[0].uuid as string | undefined
    if (!leastSimilarStoryId) {
      return
    }
    return await storiesIndex.fetch([leastSimilarStoryId])
  },
  getSemiSimilarStory: async (
    embedding: number[],
    lastTopics: string[],
    excludedStoryIds: string[],
  ) => {
    const similarStory = await storiesIndex
      .query({
        vector: embedding,
        topK: 1,
        includeValues: true,
        includeMetadata: true,
        filter: {
          tags: { $in: lastTopics },
          ...excludedStoryFilter(excludedStoryIds),
        },
      })
      .then((res) => res.matches[0])
    if (!similarStory) {
      return
    }
    // TODO: same as before - invert, except take from end of array of disimilar stories
    return similarStory
  },
}

import { Pinecone } from '@pinecone-database/pinecone'
import { storySchema } from '~/app/data/types'
import { env } from '~/env'

const pc = new Pinecone({ apiKey: env.PINECONE_API_KEY })
const storiesIndex = pc.index('stories', env.STORIES_INDEX_HOST)

const excludedStoryFilter = (excludedStoryIds: string[]) => {
  return {
    id: { $nin: excludedStoryIds },
  }
}

export const vectorDb = {
  getSimilarStory: async (embedding: number[], excludedStoryIds: string[]) => {
    const res = await storiesIndex
      .query({
        vector: embedding,
        topK: 1,
        includeValues: true,
        includeMetadata: true,
        filter: excludedStoryFilter(excludedStoryIds),
      })
      .then((res) => res.matches[0])
    const { metadata, values } = res ?? {}
    return storySchema.parse({ ...metadata, embedding: values })
  },
  getDissimilarStory: async (embedding: number[], excludedStoryIds: string[]) => {
    const mostSimilarStory = await vectorDb.getSimilarStory(embedding, excludedStoryIds)
    const leastSimilarStoryId = mostSimilarStory.least_similar_articles.find(
      ({ uuid }) => !excludedStoryIds.includes(uuid),
    )?.uuid
    if (!leastSimilarStoryId) {
      throw new Error('No dissimilar story found')
    }
    const res = await storiesIndex
      .fetch([leastSimilarStoryId])
      .then((res) => res.records[leastSimilarStoryId])
    const { metadata, values } = res ?? {}
    return storySchema.parse({ ...metadata, embedding: values })
  },
  getSemiSimilarStory: async (
    embedding: number[],
    lastTopics: string[],
    excludedStoryIds: string[],
  ) => {
    const mostSimilarStory = await storiesIndex
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
    const { metadata, values } = mostSimilarStory ?? {}
    const similarInTopic = storySchema.parse({ ...metadata, embedding: values })

    const leastSimilarStoryId = similarInTopic.least_similar_articles.find(
      ({ uuid }) => !excludedStoryIds.includes(uuid),
    )?.uuid
    if (!leastSimilarStoryId) {
      throw new Error('No dissimilar story found')
    }
    const res = await storiesIndex
      .fetch([leastSimilarStoryId])
      .then((res) => res.records[leastSimilarStoryId])
    const { metadata: finalMetadata, values: finalValues } = res ?? {}
    return storySchema.parse({ ...finalMetadata, embedding: finalValues })
  },
}

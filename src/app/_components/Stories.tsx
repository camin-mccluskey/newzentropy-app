'use client'

import { useStorage } from '~/lib/hooks/useStorage'
import { api } from '~/trpc/react'
import { Story } from './Story'
import { MiniMap } from './MiniMap'

export function Stories() {
  const {
    state: {
      activity: { history },
      personality: { embedding },
      settings: { mode },
    },
  } = useStorage()
  // compress vector embedding
  const compressed = compressVector(embedding)
  const { data: story, isLoading } = api.story.getStory.useQuery({
    compressedEmbedding: compressed,
    history: history.map((s) => s.storyId),
    mode,
    lastTopics: history[history.length - 1]?.tags ?? [],
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!story) {
    return <div>No more stories today</div>
  }

  return (
    <>
      <Story story={story} />
      <MiniMap userVector={embedding} storyVector={story.embedding} />
    </>
  )
}

const compressVector = (vector: number[]) => {
  // quantize vector first
  const quantizedVector = quantizeVector(vector)
  // Convert to string and compress
  const vectorString = quantizedVector.join(',')
  const compressed = btoa(encodeURIComponent(vectorString))
  return compressed
}

const quantizeVector = (vector: number[], precision = 9) => {
  return vector.map((v) => Number(v.toFixed(precision)))
}

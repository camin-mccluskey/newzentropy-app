'use client'

import { useStorage } from '~/lib/hooks/useStorage'
import { api } from '~/trpc/react'
import { Story } from './Story'

export function Stories() {
  const {
    state: {
      activity: { history },
      personality: { embedding },
      settings: { mode },
    },
  } = useStorage()
  const { data: story, isLoading } = api.story.getStory.useQuery({
    embedding,
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

  return <Story story={story} />
}

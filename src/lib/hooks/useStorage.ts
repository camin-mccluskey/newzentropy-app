import { useCallback } from "react"
import { useLocalStorage } from "usehooks-ts"
import { stories } from "~/app/data/stories"
import { useQueryState } from "nuqs"
import { parseAsInteger } from "nuqs/server"
import { createSearchParamsCache } from "nuqs/server"

const KEY = 'mena-storage'

export enum Mode {
  PLACATE = 'placate',
  SURPRISE = 'surprise',
  CHALLENGE = 'challenge',
}
type StoryStats = {
  storyId: string
  storyIdx: number
  viewTime: number
  rating: number
  clicked: boolean
}

type State = {
  activity: {
    history: StoryStats[]
    lastVisited: number
  },
  personality: {
    embedding: number[]
    bigFive: {
      openness: number
      conscientiousness: number
      extraversion: number
      agreeableness: number
      neuroticism: number
    }
  }
  settings: {
    mode: Mode
  }
}

const initialState: State = {
  activity: {
    history: [
      { storyId: stories[0]?.uuid ?? '', storyIdx: 0, viewTime: 0, rating: 0, clicked: false },
    ],
    lastVisited: Date.now()
  },
  personality: {
    embedding: [],
    bigFive: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
    }
  },
  settings: {
    mode: Mode.CHALLENGE
  }
}

export const searchParamsCache = createSearchParamsCache({
  story: parseAsInteger.withDefault(0)
})

export function useStorage()  {
  const [storyIdx, setStoryIdx] = useQueryState('story', parseAsInteger.withDefault(0)) 
  const safeStoryIdx = Math.max(0, Math.min(storyIdx, stories.length - 1))
  const [value, setValue, removeValue] = useLocalStorage<State>(KEY, initialState)
  
  const onChangeMode = useCallback((mode: Mode) => {
    setValue((value) => ({ ...value, settings: { ...value.settings, mode } }))
  }, [setValue])
  
  // const onPrevStory = () => {
  //   setValue((value) => ({ ...value, activity: { ...value.activity, currentStoryIdx: Math.max(0, value.activity.currentStoryIdx - 1), lastVisited: Date.now() } }))
  // }
  
  const onVote = useCallback(async (type: 'up' | 'down') => {
    setValue((value) => {
      const { history } = value.activity
      const [oldHistory, currentStory] = [history.slice(0, -1), history[history.length - 1]]
      if (!currentStory) return value
      return { ...value, activity: { history: [...oldHistory, { ...currentStory, rating: type === 'up' ? 1 : -1}], lastVisited: Date.now() } }
    })
    await setStoryIdx(value.activity.history.length)
  }, [setValue, setStoryIdx, value.activity.history.length])
  
  const onUpvote = useCallback(() => onVote('up'), [onVote])
  const onDownvote = useCallback(() => onVote('down'), [onVote])
  
  const onClickStory = useCallback(() => {
    setValue((value) => {
      const { history } = value.activity
      const [oldHistory, currentStory] = [history.slice(0, -1), history[history.length - 1]]
      if (!currentStory) return value
      return { ...value, activity: { history: [...oldHistory, { ...currentStory, clicked: true }], lastVisited: Date.now() } }
    })
  }, [setValue])
  
  const onViewStory = useCallback(() =>  {
    // push new story to history if not present
    const newStory = { storyId: stories[safeStoryIdx]?.uuid ?? '', storyIdx: safeStoryIdx, viewTime: 0, rating: 0, clicked: false }
    if (!value.activity.history.find((story) => story.storyId === newStory.storyId)) {
      setValue((value) => ({ ...value, activity: { ...value.activity, history: [...value.activity.history, newStory], lastVisited: Date.now() } }))
    }
  }, [safeStoryIdx, value.activity.history, setValue])
  
  return {
    state: value,
    setState: setValue,
    clearState: removeValue,
    onChangeMode,
    onClickStory,
    onViewStory,
    onUpvote,
    onDownvote,
  }
}
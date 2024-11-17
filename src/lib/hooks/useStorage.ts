import { useLocalStorage } from "usehooks-ts"

const KEY = 'mena-storage'

type Mode = 'placate' | 'surprise' | 'challenge'
type StoryStats = {
  storyId: string
  viewTime: number
  rating: number
  clicked: boolean
}

type State = {
  activity: {
    currentStory: StoryStats
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
    currentStory: { storyId: '', viewTime: 0, rating: 0, clicked: false },
    history: [],
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
    mode: 'challenge'
  }
}

export function useStorage()  {
  const [value, setValue, removeValue] = useLocalStorage<State>(KEY, initialState)
  
  return {
    state: value,
    setState: setValue,
    clearState: removeValue
  }
}
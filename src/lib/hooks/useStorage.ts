import { useCallback } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { type Story } from '~/app/data/types'

const KEY = 'newzentropy-storage'

export enum Mode {
  PLACATE = 'placate',
  SURPRISE = 'surprise',
  CHALLENGE = 'challenge',
}
type StoryStats = {
  storyId: string
  tags: string[]
  viewTime: number
  rating: number
  clicked: boolean
}

type State = {
  activity: {
    history: StoryStats[]
    lastVisited: number
  }
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
    history: [],
    lastVisited: Date.now(),
  },
  personality: {
    embedding: Array.from({ length: 384 }, () => Math.random()),
    bigFive: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
    },
  },
  settings: {
    mode: Mode.CHALLENGE,
  },
}

// UPDATE CONSTANTS
const ALPHA = 0.25
const VOTE_WEIGHT = -0.5
const CLICK_WEIGHT = 1
const PER_SECOND_VIEWED_WEIGHT = 0.05

export function useStorage() {
  const [state, setState, removeValue] = useLocalStorage<State>(KEY, initialState, {
    initializeWithValue: false,
  })

  const onChangeMode = useCallback(
    (mode: Mode) => {
      setState((value) => ({ ...value, settings: { ...value.settings, mode } }))
    },
    [setState],
  )

  const _updateUserEmbedding = useCallback(
    (storyEmbedding: number[], storyStats: StoryStats) => {
      // score the stat
      const { rating, clicked, viewTime } = storyStats
      const score =
        rating * VOTE_WEIGHT +
        (clicked ? CLICK_WEIGHT : 0) +
        Math.max(10, viewTime / 1000) * PER_SECOND_VIEWED_WEIGHT

      // get the user embedding
      const userEmbedding = state.personality.embedding

      // calculate the new user embedding
      const direction = storyEmbedding.map((storyDim, i) => storyDim - (userEmbedding[i] ?? 0))
      const diff = direction.map((d) => d * score * ALPHA)
      const newUserEmbedding = userEmbedding.map((d, i) => d + (diff[i] ?? 0))
      setState((value) => ({
        ...value,
        personality: { ...value.personality, embedding: newUserEmbedding },
      }))
    },
    [setState, state.personality.embedding],
  )

  const onVote = useCallback(
    async (type: 'up' | 'down', story: Story, viewTime: number) => {
      const storyStat = {
        storyId: story.id,
        tags: story.tags,
        rating: type === 'up' ? 1 : -1,
        clicked: false,
        viewTime,
      }
      setState((value) => {
        const { history } = value.activity
        return {
          ...value,
          activity: {
            history: [...history, storyStat],
            lastVisited: Date.now(),
          },
        }
      })
      _updateUserEmbedding(story.embedding, storyStat)
    },
    [setState, _updateUserEmbedding],
  )

  const onUpvote = useCallback(
    (story: Story, viewTime: number) => onVote('up', story, viewTime),
    [onVote],
  )
  const onDownvote = useCallback(
    (story: Story, viewTime: number) => onVote('down', story, viewTime),
    [onVote],
  )

  const onVisitStory = useCallback(
    (story: Story, viewTime: number) => {
      const storyStat = {
        storyId: story.id,
        tags: story.tags,
        rating: 0,
        clicked: true,
        viewTime,
      }
      setState((value) => {
        const { history } = value.activity
        return {
          ...value,
          activity: {
            history: [...history, storyStat],
            lastVisited: Date.now(),
          },
        }
      })
      _updateUserEmbedding(story.embedding, storyStat)
    },
    [setState, _updateUserEmbedding],
  )

  return {
    state: state,
    setState: setState,
    clearState: removeValue,
    onChangeMode,
    onVisitStory,
    onUpvote,
    onDownvote,
  }
}

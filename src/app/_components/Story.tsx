'use client'
import { ExternalLinkIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { type Story } from '../data/types'
import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { useCallback, useEffect, useRef } from 'react'
import { useStorage } from '~/lib/hooks/useStorage'

type StoryProps = {
  story: Story
}

export function Story({ story }: StoryProps) {
  const { onVisitStory, onUpvote, onDownvote } = useStorage()
  const renderStart = useRef(Date.now())

  useEffect(() => {
    renderStart.current = Date.now()
  }, [])

  const getStoryViewTime = useCallback(() => {
    return Date.now() - renderStart.current
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{story.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-end justify-between gap-2">
        <div className="space-y-1">
          <Link
            href={story.url}
            className="flex items-center gap-1 text-secondary-foreground transition-colors hover:text-primary"
            target="_blank"
            onClick={() => onVisitStory(story, getStoryViewTime())}
          >
            Visit story
            <ExternalLinkIcon className="size-4" />
          </Link>
          <span className="inline-flex flex-wrap items-center gap-1">
            {story.tags.map((tag) => (
              <Badge variant="outline" key={tag}>
                {tag}
              </Badge>
            ))}
          </span>
        </div>
        <span className="inline-flex gap-2">
          <Button size="icon" variant="default" onClick={() => onUpvote(story, getStoryViewTime())}>
            <ThumbsUpIcon />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDownvote(story, getStoryViewTime())}
          >
            <ThumbsDownIcon />
          </Button>
        </span>
      </CardFooter>
    </Card>
  )
}

'use client'
import { ExternalLinkIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { type Story } from "../data/types";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { useEffect, useRef } from "react";
import { useStorage } from "~/lib/hooks/useStorage";

type StoryProps = {
  story: Story
}

export function Story({ story }: StoryProps) {
  const { onViewStory, onClickStory, onUpvote, onDownvote } = useStorage()
  // const renderStart = useRef(Date.now());
  
  useEffect(() => {
    onViewStory()
  }, [onViewStory])

  // useEffect(() => {
  //   const startTime = renderStart.current;
  //   return () => {
  //     const timeRendered = Date.now() - startTime;
  //   };
  // }, [onViewStory]);

  return (
   <Card>
    <CardHeader>
      <CardTitle>{story.title}</CardTitle>
      </CardHeader>
    <CardContent>
      <CardDescription>{story.description}</CardDescription>
    </CardContent>
    <CardFooter className="flex gap-2 items-end justify-between">
      <div className="space-y-1">
        <Link href={story.url} className="text-secondary-foreground hover:text-primary transition-colors flex items-center gap-1" target="_blank" onClick={onClickStory}>
          Visit story
        <ExternalLinkIcon className="size-4" />
        </Link>
        <span className="inline-flex items-center gap-1 flex-wrap">
          {story.tags.map((tag) => (
            <Badge variant="outline" key={tag}>{tag}</Badge>
          ))}
        </span>
      </div>
      <span className="inline-flex gap-2">
        <Button size="icon" variant="default" onClick={() => onUpvote()}>
          <ThumbsUpIcon/>
        </Button>
        <Button size="icon" variant="destructive" onClick={() => onDownvote()}>
          <ThumbsDownIcon/>
        </Button>
      </span>
    </CardFooter>
   </Card> 
  ) 
}

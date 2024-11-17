'use client'
import { ExternalLinkIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { type Story } from "../data/types";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";

type StoryProps = {
  story: Story
}

export function Story({ story }: StoryProps) {
  const renderStart = useRef(Date.now());

  useEffect(() => {
    const startTime = renderStart.current;
    return () => {
      const timeRendered = Date.now() - startTime;
      console.log(`Component was rendered for ${timeRendered} ms`);
    };
  }, []);

  const onUpvote = () => {
    console.log('upvote')
  }

  const onDownvote = () => {
    console.log('downvote')
  }
  
  const onViewStory = () => {
    console.log('view story')
  }

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
        <Link href={story.url} className="text-secondary-foreground hover:text-primary transition-colors flex items-center gap-1" target="_blank" onClick={onViewStory}>
          View story
              <ExternalLinkIcon className="size-4" />
        </Link>
        <span className="inline-flex items-center gap-1 flex-wrap">
          {story.tags.map((tag) => (
            <Badge variant="outline" key={tag}>{tag}</Badge>
          ))}
        </span>
      </div>
      <span className="inline-flex gap-2">
        <Button size="icon" variant="default" onClick={onUpvote}>
          <ThumbsUpIcon/>
        </Button>
        <Button size="icon" variant="destructive" onClick={onDownvote}>
          <ThumbsDownIcon/>
        </Button>
      </span>
    </CardFooter>
   </Card> 
  ) 
}

import { ExternalLinkIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { type Story } from "../data/types";
import Link from "next/link";

type StoryProps = {
  story: Story
}

export function Story({ story }: StoryProps) {
  return (
   <Card>
    <CardHeader>
      <CardTitle>{story.title}</CardTitle>
      </CardHeader>
    <CardContent>
      <CardDescription>{story.description}</CardDescription>
    </CardContent>
    <CardFooter className="flex gap-2 items-end justify-between">
        <Link href={story.url} className="text-secondary-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
          View story
          <ExternalLinkIcon className="size-4" />
        </Link>
      <span className="inline-flex gap-2">
        <Button size="icon" variant="default">
          <ThumbsUpIcon/>
        </Button>
        <Button size="icon" variant="destructive">
          <ThumbsDownIcon/>
        </Button>
      </span>
    </CardFooter>
   </Card> 
  ) 
}

'use client'

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { useStorage } from "~/lib/hooks/useStorage";
import { cn } from "~/lib/utils";

type ProfileProps = {
  className?: string
}

export function Profile({ className }: ProfileProps) {
  const { state: { personality }, clearState } = useStorage()
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = personality.bigFive

  return (
   <Card className={cn('shadow-none', className)}>
    <CardHeader>
      <CardTitle>Profile</CardTitle>
    </CardHeader> 
      <CardContent>
        <ul className="space-y-4">
          <ProfileAspect title="Openness" value={openness} />
          <ProfileAspect title="Conscientiousness" value={conscientiousness} />
          <ProfileAspect title="Extraversion" value={extraversion} />
          <ProfileAspect title="Agreeableness" value={agreeableness} />
          <ProfileAspect title="Neuroticism" value={neuroticism} />
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="place-self-end" size="sm" onClick={clearState}>Reset</Button>
      </CardFooter>
   </Card>
  )
}

type ProfileAspectProps = {
  title: string
  value: number | null
}

const ProfileAspect = ({ title, value }: ProfileAspectProps) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium">{title}</p>
      <Progress value={value} className="w-full" />
    </div>
  )
}
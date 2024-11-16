import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export function Story() {
  return (
   <Card>
    <CardHeader>
      <CardTitle>Super cool news story</CardTitle>
      </CardHeader>
    <CardContent>
      <CardDescription>This is a super cool news story</CardDescription>
    </CardContent>
    <CardFooter className="flex gap-2 items-center place-self-end">
      <Button size="icon" variant="default">
        <ThumbsUpIcon/>
      </Button>
      <Button size="icon" variant="destructive">
        <ThumbsDownIcon/>
      </Button>
    </CardFooter>
   </Card> 
  ) 
}

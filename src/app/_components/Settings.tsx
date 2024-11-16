import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export function Settings() {
  return (
    <Card className="shadow-none">
      <CardHeader>Settings</CardHeader>
      <CardContent>
       <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">
          <p>Placate me</p>
              <p className="text-sm text-muted-foreground">Show me stories most similar to my interests</p>
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">
          <p>Surpise me</p>
          <p className="text-sm text-muted-foreground">Stay true to my interests but maximise my surprise</p>
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">
          <p>Challenge me</p>
          <p className="text-sm text-muted-foreground">Show me stories totally outside my interests</p>
        </Label>
      </div>
    </RadioGroup> 
      </CardContent>
      
    </Card> 
  )
}
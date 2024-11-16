import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";

export function About() {
  return  (
   <Card className="shadow-none min-w-60">
      <Collapsible>
        <CollapsibleTrigger className="w-full group">
          <CardHeader className="flex flex-row space-y-0 items-center justify-between">
            <CardTitle>About this project</CardTitle> 
            <ChevronLeft className="size-4 group-data-[state=open]:-rotate-90 group-hover:-rotate-90 transition-transform duration-300" />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <p>This is a projects that I made</p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
   </Card> 
  )
}
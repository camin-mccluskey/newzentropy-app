import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function PrevButton() {
  return (
    <Button className="w-fit">
      <ArrowLeftIcon className="size-4" />
      Previous
    </Button>    
  )
}

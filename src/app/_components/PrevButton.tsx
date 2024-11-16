import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function PrevButton() {
  return (
    <Button>
      <ArrowLeftIcon className="size-4" />
      Previous
    </Button>    
  )
}

'use client'

import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function PrevButton() {
  const onPrevious = () => {
    console.log('previous')
  }

  return (
    <Button className="w-fit" onClick={onPrevious}>
      <ArrowLeftIcon className="size-4" />
      Previous
    </Button>    
  )
}

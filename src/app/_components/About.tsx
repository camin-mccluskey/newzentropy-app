import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'
import { Button, buttonVariants } from '~/components/ui/button'
import Link from 'next/link'
import Script from 'next/script'

export function About() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Learn more</Button>
      </SheetTrigger>
      <SheetContent className="flex w-[500px] flex-col justify-between gap-y-5">
        <div className="space-y-3">
          <SheetHeader>
            <SheetTitle>About</SheetTitle>
          </SheetHeader>
          <div className="space-y-5">
            <p className="text-sm text-gray-500">
              This is a tiny project to see what it might look like to actively challenge your
              biases, since everywhere else on the web has a vested interest in keeping you engaged.
              Play around, share with friends and let me know what you think!
            </p>
            <p>
              If you enjoyed this you may also like my startup - Stackfix.
              <br /> We&apos;re a platform cutting through the biased world of software reviews to
              help you find, compare and buy the right software for your business. Get notified
              about our upcoming ProductHunt launch{' '}
              <Link
                className="text-blue-500 underline"
                href="https://www.producthunt.com/products/stackfix"
              >
                here
              </Link>
              .
            </p>
          </div>
        </div>
        <Link
          href="https://buymeacoffee.com/camin"
          className={buttonVariants({ className: 'self-end' })}
        >
          ☕️ Buy me a coffee
        </Link>
      </SheetContent>
    </Sheet>
  )
}


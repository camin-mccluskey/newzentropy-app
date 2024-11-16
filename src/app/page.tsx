import { HydrateClient } from "~/trpc/server";
import { Story } from "./_components/Story";
import { PrevButton } from "./_components/PrevButton";
import { Settings } from "./_components/Settings";
import { About } from "./_components/About";
import { Profile } from "./_components/Profile";
import { stories } from "./data/stories";
import Link from "next/link";

export default function Home({ searchParams }: { searchParams: { story?: string } }) {
  const storyIdx = searchParams.story ? parseInt(searchParams.story) : 0
  const currentStory = stories[storyIdx]

  return (
    <HydrateClient>
      <main className="flex min-h-screen max-w-screen-2xl items-stretch justify-between mx-auto flex-col p-10">
        <section className="flex justify-between">
          <div className="flex flex-col items-stretch gap-4 basis-2/5">
            {currentStory && (
              <Story key={currentStory.uuid} story={currentStory} />
            )}
            <PrevButton />
          </div>
          <Profile className="basis-1/5" />
        </section>
        <section className="flex justify-between items-end">
          <About />
          <Settings />
        </section>
      </main>
    </HydrateClient>
  );
}

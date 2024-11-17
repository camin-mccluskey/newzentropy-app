import { HydrateClient } from "~/trpc/server";
import { Story } from "./_components/Story";
// import { PrevButton } from "./_components/PrevButton";
import { Settings } from "./_components/Settings";
import { About } from "./_components/About";
import { Profile } from "./_components/Profile";
import { stories } from "./data/stories";

export default function Home({ searchParams }: { searchParams: { story?: string } }) {
  const storyIdx = searchParams.story ? parseInt(searchParams.story) : 0
  const currentStory = stories[storyIdx]

  return (
    <HydrateClient>
      <main className="flex min-h-screen max-w-screen-2xl gap-5 items-stretch justify-between mx-auto flex-col md:p-10 p-5">
        <section className="flex justify-between flex-wrap gap-5">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-500 to-fuchsia-500 bg-clip-text text-transparent">Newzentropy</h1>
          <div className="flex flex-col items-stretch gap-4 md:basis-2/5">
            {currentStory && (
              <Story key={currentStory.uuid} story={currentStory} />
            )}
            {/* <PrevButton /> */}
          </div>
          <Profile className="md:basis-1/5 w-full" />
        </section>
        <section className="flex justify-between items-end gap-5 flex-col md:flex-row-reverse">
          <Settings />
          <About />
        </section>
      </main>
    </HydrateClient>
  );
}

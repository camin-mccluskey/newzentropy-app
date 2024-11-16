import { HydrateClient } from "~/trpc/server";
import { Story } from "./_components/Story";
import { PrevButton } from "./_components/PrevButton";
import { Settings } from "./_components/Settings";
import { About } from "./_components/About";
import { Profile } from "./_components/Profile";

export default async function Home() {

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Story />
        <PrevButton />
        <Settings />
        <Profile />
        <About />
      </main>
    </HydrateClient>
  );
}

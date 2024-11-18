import { HydrateClient } from '~/trpc/server'
import { Settings } from './_components/Settings'
import { About } from './_components/About'
import { Profile } from './_components/Profile'
import { Stories } from './_components/Stories'

export default async function Home() {
  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen max-w-screen-2xl flex-col items-stretch justify-between gap-5 p-5 md:p-10">
        <section className="flex flex-wrap justify-between gap-5">
          <h1 className="bg-gradient-to-r from-amber-500 to-fuchsia-500 bg-clip-text text-center text-3xl font-bold text-transparent">
            Newzentropy
          </h1>
          <div className="flex flex-col items-stretch gap-4 md:basis-2/5">
            <Stories />
            {/* <PrevButton /> */}
          </div>
          <Profile className="w-full md:basis-1/5" />
        </section>
        <section className="flex flex-col items-end justify-between gap-5 md:flex-row-reverse">
          <Settings />
          <About />
        </section>
      </main>
    </HydrateClient>
  )
}

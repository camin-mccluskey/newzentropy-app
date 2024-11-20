import { HydrateClient } from '~/trpc/server'
import { Settings } from './_components/Settings'
import { About } from './_components/About'
import { Profile } from './_components/Profile'
import { Stories } from './_components/Stories'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen max-w-screen-2xl flex-col items-stretch justify-between gap-5 p-5 md:p-10">
        <section className="flex flex-wrap justify-between gap-5">
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-amber-500 to-fuchsia-500 bg-clip-text text-3xl font-bold text-transparent">
              Newzentropy
            </h1>
            <Link
              href="https://www.producthunt.com/posts/newzentropy?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-newzentropy"
              target="_blank"
            >
              <Image
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=632387&theme=light"
                alt="Newzentropy - The&#0032;only&#0032;news&#0032;source&#0032;giving&#0032;you&#0032;less&#0032;of&#0032;what&#0032;you&#0032;want | Product Hunt"
                className="h-[54px] w-[250px]"
                width="250"
                height="54"
                unoptimized
              />
            </Link>
          </div>
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

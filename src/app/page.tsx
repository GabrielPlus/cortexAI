import { onGetBlogPosts } from '@/actions/landing'
import NavBar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCards } from '@/constants/landing-page'
import clsx from 'clsx'
import { ArrowRightCircleIcon, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import parse from 'html-react-parser'
import { getMonthName } from '@/lib/utils'

export default async function Home() {
  const posts:
    | {
        id: string
        title: string
        image: string
        content: string
        createdAt: Date
      }[]
    | undefined = await onGetBlogPosts()
  console.log(posts)
  return (
    <main>
      <NavBar />
      <section>
        <div className="flex items-center justify-center flex-col mt-[80px] gap-4 ">
          <span className="text-indigo-900 bg-indigo-300 px-4 py-2 rounded-full text-sm">
            Techkidz Africa Space Hub
          </span>
          <p className="text-center max-w-[500px]">
 Access AI bot, track your attendance, and stay up to date with the latest from the TKA Newsroom — everything we need, all in one place.
          </p>
      <Link
        href="/dashboard"
        className=" px-4 py-2 rounded-sm text-white"
      ><Button className=" font-bold text-white px-4">
          Sign In
          </Button>
      </Link>
        </div>
      </section>

      <section className="flex justify-center items-center flex-col gap-4 mt-28">
        <h2 className="text-4xl text-center">News Room</h2>
        <p className="text-muted-foreground text-center max-w-lg">
          Explore our insights on AI, technology, and optimizing your business.
        </p>
      </section>
      <section className="md:grid-cols-3 grid-cols-1 grid gap-5 container mt-8">
        {posts &&
          posts.map((post) => (
            <Link
              href={`/blogs/${post.id}`}
              key={post.id}
            >
              <Card className="flex flex-col gap-2 rounded-xl overflow-hidden h-full hover:bg-gray-100">
                <div className="relative w-full aspect-video">
                  <Image
                    src={`${process.env.CLOUDWAYS_UPLOADS_URL}${post.image}`}
                    alt="post featured image"
                    fill
                  />
                </div>
                <div className="py-5 px-10 flex flex-col gap-5">
                  <CardDescription>
                    {getMonthName(post.createdAt.getMonth())}{' '}
                    {post.createdAt.getDate()} {post.createdAt.getFullYear()}
                  </CardDescription>
                  <CardTitle>{post.title}</CardTitle>
                  {parse(post.content.slice(4, 100))}...
                </div>
              </Card>
            </Link>
          ))}
      </section>
    </main>
  )
}
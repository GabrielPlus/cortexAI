import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const Layout = async ({ children }: Props) => {
  const user = await currentUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="hh-screen flex w-full justify-center">
      <div className="w-[600px] lg:w-1/2 flex flex-col items-start p-6">
        <Image
          src="/images/logo.png"
          alt="LOGO"
          sizes="100vw"
          style={{
            width: '20%',
            height: 'auto',
          }}
          width={0}
          height={0}
        />
        {children}
      </div>
      <div className="hidden lg:flex flex-1 max-h-full overflow-hidden relative bg-cream flex-col pt-10 pl-24 gap-3">
        <h2 className="text-gravel text-2xl md:text-4xl font-bold">
          Hi, I’m your AI powered chat assistant, Cortex!
        </h2>
        <p className="text-iridium text-sm md:text-base mb-10">
          Cortex is capable of capturing lead information without a form...{' '}
          <br />
          something never done before 😉
        </p>
        <div className="relative w-full">
          <Image
            src="/images/app-ui.png"
            alt="app image"
            loading="lazy"
            layout="responsive"
            width={1600}
            height={900}
            className="top-48 left-0 shrink-0 !w-[1600px]"
          />
        </div>
      </div>
    </div>
  )
}

export default Layout

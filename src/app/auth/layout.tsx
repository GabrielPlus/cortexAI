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
        {children}
      </div>
    </div>
  )
}

export default Layout

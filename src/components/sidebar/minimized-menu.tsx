import { SIDE_BAR_MENU } from '@/constants/menu'
import React from 'react'
import { LogOut, MonitorSmartphone } from 'lucide-react'
import { MenuLogo } from '@/icons/menu-logo'
import MenuItem from './menu-item'
import DomainMenu from './domain-menu'
import { Button } from '../ui/button'
import Image from 'next/image'

type MinMenuProps = {
  onShrink(): void
  current: string
  onSignOut(): void
  domains:
    | {
        id: string
        name: string
        icon: string | null
      }[]
    | null
    | undefined
}

export const MinMenu = ({
  onShrink,
  current,
  onSignOut,
  domains,
}: MinMenuProps) => {
  return (
    <div className="p-3 flex flex-col items-center h-full">
      {/* Logo Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onShrink}
        className="focus:outline-none hover:bg-transparent animate-fade-in opacity-0 delay-300 fill-mode-forwards"
      >
        <Image
          src="/images/gif.gif"
          alt="LOGO"
          width={40}
          height={40}
          className="rounded-full object-contain"
          unoptimized
        />
      </Button>

      {/* Menu Items */}
      <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10 w-full">
        <div className="flex flex-col items-center">
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              size="min"
              {...menu}
              key={key}
              current={current}
            />
          ))}
          <DomainMenu min domains={domains} />
        </div>

        {/* Sign Out Button */}
        <div className="flex flex-col items-center">
          <MenuItem
            size="min"
            label="Sign out"
            icon={<LogOut />}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </div>
  )
}
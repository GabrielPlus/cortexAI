import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'

function NavBar() {
  return (
    <div className="flex justify-between items-center px-7 py-1 font-bold border-b border-solid border-zinc-100 leading-[154.5%] max-md:px-5">
      {/* Logo Container - Left aligned on all screens */}
      <div className="flex-shrink-0">
        <Image
          src="/images/rt.gif"
          alt="LOGO"
          width={50}  // Set explicit width
          height={50} // Set explicit height
          className="animate-fade-in opacity-0 delay-300 fill-mode-forwards rounded-full"
          unoptimized
        />
      </div>

      {/* Sign In Button - Right aligned */}
      <Link  href="/dashboard" passHref legacyBehavior>
        <Button         
        className="font-bold text-white px-4 py-2 rounded-sm hover:bg-orange-600">
          Sign In
        </Button>
      </Link>
    </div>
  )
}

export default NavBar
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const Responding = () => {
  return (
<div className="self-start flex items-end gap-3">
  <Avatar className="w-10 h-10">
    {/* Replace the fallback with your image */}
    <AvatarImage src="/images/gif.gif" />
    <AvatarFallback>
      {/* Optional: You can keep a fallback in case the image fails to load */}
      <img src="/images/gif.gif" alt="Fallback" className="w-full h-full object-cover" />
    </AvatarFallback>
  </Avatar>
  
  <div className="typing ">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
</div>
  )
}
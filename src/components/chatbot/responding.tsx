import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'

export const Responding = () => {
  return (
    <div className="self-start flex items-end gap-3">
      <Avatar className="w-5 h-5">
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
      <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  )
}
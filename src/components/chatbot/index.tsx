'use client'
import { useChatBot } from '@/hooks/chatbot/use-chatbot'
import React from 'react'
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BotIcon } from '@/icons/bot-icon'
import BotWindow from './window'

type Props = {}

const AiChatBot = (props: Props) => {
  const {
    onOpenChatBot,
    botOpened,
    onChats,
    register,
    onStartChatting,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    onRealTime,
    setOnChats,
    errors,
  } = useChatBot()

  // Function to close the bot window
  const closeChatBot = () => {
    onOpenChatBot() // Toggle botOpened state
  }

  return (
    <div className="h-screen flex flex-col justify-end items-end gap-4">
      {/* Chat Window */}
      {botOpened && (
        <div className="relative">
          <BotWindow
            errors={errors}
            setChat={setOnChats}
            realtimeMode={onRealTime}
            helpdesk={currentBot?.helpdesk!}
            domainName={currentBot?.name!}
            ref={messageWindowRef}
            help={currentBot?.chatBot?.helpdesk}
            theme={currentBot?.chatBot?.background}
            textColor={currentBot?.chatBot?.textColor}
            chats={onChats}
            register={register}
            onChat={onStartChatting}
            onResponding={onAiTyping}
          />
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-blue-200 transition duration-200"
            onClick={closeChatBot}
          >
            <ChevronDown size={28} className="font-bold text-gray-900" />
          </button>

        </div>
      )}

      {!botOpened && !loading && (
        <div className="relative flex items-center cursor-pointer" onClick={onOpenChatBot}>

          <div className="w-20 h-20 flex items-center justify-center shadow-md">
            {currentBot?.chatBot?.icon ? (
              <Image
                src={`https://ucarecdn.com/${currentBot.chatBot.icon}/`}
                alt="bot"
                width={80}
                height={80}
              />
            ) : (

              <BotIcon />
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default AiChatBot
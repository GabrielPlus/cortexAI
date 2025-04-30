"use client"
import { useConversation } from '@/hooks/conversation/use-conversation'
import React from 'react'
import TabsMenu from '../tabs'
import { TABS_MENU } from '@/constants/menu'
import { TabsContent } from '../ui/tabs'
import ConversationSearch from './search'
import { Loader } from '../loader'
import ChatCard from './chart-card'
import { CardDescription } from '../ui/card'
import { Separator } from '../ui/separator'

type Props = {
  domains?:
  | {
    name: string
    id: string
    icon: string
  }[]
  | undefined
}

const ConversationMenu = ({ domains }: Props) => {
  const { register, chatRooms, loading, onGetActiveChatMessages } =
    useConversation()
  return (
    <div className="py-3 px-3">
      <TabsMenu triggers={TABS_MENU}>
        <TabsContent value="All inbox">
          <ConversationSearch
            domains={domains}
            register={register}
          />
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2">
            <Loader loading={loading}>
              {chatRooms.length ? (
                chatRooms.map((room) => (
                  <ChatCard
                    seen={room.chatRoom[0].message[0]?.seen}
                    id={room.chatRoom[0].id}
                    onChat={() => onGetActiveChatMessages(room.chatRoom[0].id)}
                    createdAt={room.chatRoom[0].message[0]?.createdAt}
                    key={room.chatRoom[0].id}
                    title={room.email!}
                    description={room.chatRoom[0].message[0]?.message}
                  />
                ))
              ) : (
                <CardDescription>No chats for your domain</CardDescription>
              )}
            </Loader>
          </div>

        </TabsContent>
      </TabsMenu>
    </div>
  )
}

export default ConversationMenu
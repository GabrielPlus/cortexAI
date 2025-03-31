import { ChatBotMessageProps } from '@/schemas/conversation.schema';
import React, { forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import RealTimeMode from './real-time';
import TabsMenu from '../tabs';
import { BOT_TABS_MENU } from '@/constants/menu';
import { TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';
import Bubble from './bubble';
import { Responding } from './responding';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IoSendSharp } from "react-icons/io5";
import { BsPaperclip } from "react-icons/bs";
import { CardDescription, CardTitle } from '../ui/card';
import Accordion from '../accordian';
import { Label } from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

type Props = {
  errors: any;
  register: UseFormRegister<ChatBotMessageProps>;
  chats: { role: 'assistant' | 'user'; content: string; link?: string }[];
  onChat(): void;
  onResponding: boolean;
  domainName: string;
  theme?: string | null;
  textColor?: string | null;
  help?: boolean;
  realtimeMode?: {
    chatroom: string;
    mode: boolean;
  } | undefined;
  helpdesk: {
    id: string;
    question: string;
    answer: string;
    domainId: string | null;
  }[];
  setChat: React.Dispatch<
    React.SetStateAction<
      {
        role: 'user' | 'assistant';
        content: string;
        link?: string | undefined;
      }[]
    >
  >;
  className?: string;
};

const BotWindow = forwardRef<HTMLDivElement, Props>(
  (
    {
      errors,
      register,
      chats,
      onChat,
      onResponding,
      domainName,
      helpdesk,
      realtimeMode,
      setChat,
      textColor,
      theme,
      help,
      className,
    },
    ref
  ) => {
    return (
      <div className={cn(
        "h-[680px] w-[380px] flex flex-col bg-white rounded-xl border-[1px] overflow-hidden",
        className
      )}>
        <div className="flex justify-between px-4 pt-4">
          <div className="flex gap-2">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src="/images/pic.png"
                alt="@shadcn"
              />
              <AvatarFallback>TK</AvatarFallback>
            </Avatar>
            <div className="flex items-start flex-col">
              <h3 className="text-lg font-bold leading-none">
                TechKidz <span>X</span>pert
              </h3>
              <p className="text-sm">{domainName.split('.com')[0]}</p>
              {realtimeMode?.mode && (
                <RealTimeMode
                  setChats={setChat}
                  chatRoomId={realtimeMode.chatroom}
                />
              )}
            </div>
          </div>
        </div>

        <TabsMenu
          triggers={BOT_TABS_MENU}
          className="bg-transparent border-[1px] border-border m-2"
        >
          <TabsContent value="chat">
            <Separator orientation="horizontal" />
            <div className="flex flex-col h-full">
              <div
                style={{
                  background: theme || '',
                  color: textColor || '',
                }}
                className="px-3 flex h-[330px] flex-col py-5 gap-3 chat-window overflow-y-auto"
                ref={ref}
              >
                {chats.map((chat, key) => (
                  <Bubble
                    key={key}
                    message={chat}
                  />
                ))}
                {onResponding && <Responding />}
              </div>
              
              <form onSubmit={onChat} className="flex px-3 py-2 flex-col flex-1">
                <div className="relative w-full mt-20">
                  <Input
                    {...register("content")}
                    className="w-full px-4 py-2 pr-12 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="text"
                    placeholder="Write a message"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-transparent border-none shadow-none hover:bg-transparent focus:ring-0"
                  >
                    <IoSendSharp className="text-gray-800 w-6 h-6" />
                  </Button>
                </div>

                <div className="mt-3">
                  <Label
                    htmlFor="upload"
                    className="inline-flex items-center gap-2 p-2 rounded-full transition duration-300 hover:bg-blue-100 cursor-pointer"
                  >
                    <BsPaperclip className="w-5 h-5 text-gray-900" />
                    <Input
                      {...register('image')}
                      type="file"
                      id="upload"
                      className="hidden"
                    />
                  </Label>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="helpdesk">
            <div className="h-[485px] overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4">
              <div>
                <CardTitle>Help Desk</CardTitle>
                <CardDescription>
                  Browse from a list of questions people usually ask.
                </CardDescription>
              </div>
              <Separator orientation="horizontal" />

              {helpdesk.map((desk) => (
                <Accordion
                  key={desk.id}
                  trigger={desk.question}
                  content={desk.answer}
                />
              ))}
            </div>
          </TabsContent>
        </TabsMenu>
      </div>
    );
  }
);

BotWindow.displayName = 'BotWindow';
export default BotWindow;
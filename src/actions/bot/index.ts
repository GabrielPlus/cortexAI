"use server";

import { client } from "@/lib/prisma";
import { extractEmailsFromString, extractURLfromString } from "@/lib/utils";
import { onRealTimeChat } from "../conversation";
import { clerkClient } from "@clerk/nextjs";
import { onMailer } from "../mailer";
import OpenAi from "openai";

const openai = new OpenAi({
  apiKey: process.env.OPEN_AI_KEY,
});

export const onStoreConversations = async (
  id: string,
  message: string,
  role: "assistant" | "user"
) => {
  await client.chatRoom.update({
    where: { id },
    data: {
      message: {
        create: { message, role },
      },
    },
  });
};

export const onGetCurrentChatBot = async (id: string) => {
  try {
    const chatbot = await client.domain.findUnique({
      where: { id },
      select: {
        helpdesk: true,
        name: true,
        chatBot: {
          select: {
            id: true,
            welcomeMessage: true,
            icon: true,
            textColor: true,
            background: true,
            helpdesk: true,
          },
        },
      },
    });
    return chatbot;
  } catch (error) {
    console.log(error);
  }
};

export const onAiChatBotAssistant = async (
  domainId: string,
  chat: { role: "assistant" | "user"; content: string }[],
  author: "user",
  message: string,
  sessionId: string
) => {
  try {
    const chatBotDomain = await client.domain.findUnique({
      where: { id: domainId },
      select: {
        name: true,
        filterQuestions: {
          where: { answered: null },
          select: { question: true },
        },
        helpdesk: {
          where: {
            NOT: { answer: "" },
          },
          select: { question: true, answer: true },
        },
      },
    });

    if (!chatBotDomain) return;

    // Get or create session
    let session = await client.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      session = await client.chatSession.create({
        data: {
          domainId,
        },
      });
    }

    // Extract email from message if it exists
    const extractedEmail = extractEmailsFromString(message);
    if (extractedEmail && !session.customerEmail) {
      session = await client.chatSession.update({
        where: { id: sessionId },
        data: { customerEmail: extractedEmail[0] },
      });
    }

    if (!session.customerEmail) {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4.1-2025-04-14",
        messages: [
          {
            role: "assistant",
            content: `
You are a helpful, friendly assistant for ${chatBotDomain.name}.
- Your first priority is to politely and naturally ask for the visitor's email address.
- Do NOT proceed to helpdesk-related questions until the email is collected.
- Keep the conversation very respectful, professional, and friendly.
- After getting the email, smoothly move into answering Helpdesk questions based on the following references:
[${chatBotDomain.helpdesk
              .map((item) => `Q: ${item.question} | A: ${item.answer}`)
              .join(", ")}]

If the user wants to speak to a real staff, reply politely and add (realtime) keyword at the end.
Format responses in markdown (e.g., use **bold**, # headings, and [links](https://example.com))
`,
          },
          ...chat,
          { role: "user", content: message },
        ],
      });

      if (chatCompletion) {
        const response = {
          role: "assistant",
          content: chatCompletion.choices[0].message.content,
        };
        return { response };
      }
    }

    // If email is already captured, continue normal flow
    const checkCustomer = await client.domain.findUnique({
      where: { id: domainId },
      select: {
        User: { select: { clerkId: true } },
        name: true,
        customer: {
          where: { email: { startsWith: session.customerEmail! } },
          select: {
            id: true,
            email: true,
            questions: true,
            chatRoom: { select: { id: true, live: true, mailed: true } },
          },
        },
      },
    });

    if (checkCustomer) {
      if (!checkCustomer.customer.length) {
        const newCustomer = await client.domain.update({
          where: { id: domainId },
          data: {
            customer: {
              create: {
                email: session.customerEmail!,
                questions: {
                  create: [
                    ...chatBotDomain.filterQuestions,
                    ...chatBotDomain.helpdesk.map((item) => ({
                      question: item.question,
                      answered: item.answer,
                    })),
                  ],
                },
                chatRoom: { create: {} },
              },
            },
          },
        });

        if (newCustomer) {
          console.log("New customer created");
          const email = session.customerEmail ?? "guest@example.com";
          const response = {
            role: "assistant",
            content: `Welcome aboard ${
              email.split("@")[0]
            }! I'm TKA virtual assistant. How can I help you today?`,
          };
          return { response };
        }
      }

      const currentChatRoom = checkCustomer.customer[0].chatRoom[0];

      if (currentChatRoom.live) {
        await onStoreConversations(currentChatRoom.id!, message, author);
        onRealTimeChat(currentChatRoom.id!, message, "user", author);

        if (!currentChatRoom.mailed) {
          const user = await clerkClient.users.getUser(
            checkCustomer.User?.clerkId!
          );
          await onMailer(user.emailAddresses[0].emailAddress);

          await client.chatRoom.update({
            where: { id: currentChatRoom.id },
            data: { mailed: true },
          });
        }

        return { live: true, chatRoom: currentChatRoom.id };
      }

      await onStoreConversations(currentChatRoom.id!, message, author);

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4.1-mini-2025-04-14",
        messages: [
          {
            role: "assistant",
            content: `
You are a helpful assistant for ${chatBotDomain.name}.
Your duties:
- Answer questions based only on this Helpdesk:
[${chatBotDomain.helpdesk
              .map((item) => `Q: ${item.question} | A: ${item.answer}`)
              .join(", ")}]
Format responses in markdown (e.g., use **bold**, # headings, and [links](https://example.com))
          `,
          },
          ...chat,
          { role: "user", content: message },
        ],
      });

      if (chatCompletion) {
        const generatedContent =
          chatCompletion.choices[0].message.content ?? "";

        if (generatedContent.includes("(realtime)")) {
          await client.chatRoom.update({
            where: { id: currentChatRoom.id },
            data: { live: true },
          });

          const response = {
            role: "assistant",
            content: generatedContent.replace("(realtime)", ""),
          };

          await onStoreConversations(
            currentChatRoom.id!,
            response.content,
            "assistant"
          );
          return { response };
        }

        if (chat[chat.length - 1]?.content.includes("(complete)")) {
          const firstUnansweredQuestion =
            await client.customerResponses.findFirst({
              where: {
                customerId: checkCustomer.customer[0].id,
                answered: null,
              },
              orderBy: { question: "asc" },
              select: { id: true },
            });

          if (firstUnansweredQuestion) {
            await client.customerResponses.update({
              where: { id: firstUnansweredQuestion.id },
              data: { answered: message },
            });
          }
        }

        const generatedLink = extractURLfromString(generatedContent);
        if (generatedLink) {
          const response = {
            role: "assistant",
            content: `Awesome! You can proceed here: ${generatedLink[0].slice(
              0,
              -1
            )}`,
          };

          await onStoreConversations(
            currentChatRoom.id!,
            response.content,
            "assistant"
          );
          return { response };
        }

        const response = {
          role: "assistant",
          content: generatedContent,
        };

        await onStoreConversations(
          currentChatRoom.id!,
          response.content,
          "assistant"
        );
        return { response };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Helper function to create new session
export const createNewSession = async (domainId: string) => {
  const newSession = await client.chatSession.create({
    data: {
      domainId,
    },
  });
  return newSession.id;
};


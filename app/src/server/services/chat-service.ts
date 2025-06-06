import { type ChatMessage, type ChatThread } from "@prisma/client";
import { type ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { type ResponseInputItem } from "openai/resources/responses/responses.mjs";
import { type Context } from "../context";
import { getModel, type ModelType } from "../utils/model-config";
import { PermissionsService } from "./permissions-service";

export type ChatThreadWithMessages = ChatThread & { messages: ChatMessage[] };

async function createThread(
  ctx: Context,
  initialMessage: string,
): Promise<ChatThread> {
  if (!ctx.user?.id) {
    throw new Error("User not found");
  }
  const thread = await ctx.db.chatThread.create({
    data: {
      user_id: ctx.user.id,
      title: "New Chat",
    },
  });

  await ctx.db.chatMessage.create({
    data: {
      role: "USER",
      content: initialMessage,
      thread_id: thread.id,
    },
  });

  void generateAndUpdateTitle(ctx, thread.id, initialMessage);

  return thread;
}

async function generateAndUpdateTitle(
  ctx: Context,
  threadId: string,
  initialMessage: string,
): Promise<ChatThread> {
  const response = await ctx.openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a title generator for Lumen, an AI assistant that helps users understand and explore the Bible. Your task is to create a concise, descriptive title for a chat conversation based on the user's initial message.

          Context:
          - Lumen helps users interpret scripture, answer theological questions, and explore biblical themes
          - Users come seeking guidance and understanding about the Bible's teachings
          - Conversations often focus on specific verses, biblical concepts, or life applications

          Guidelines:
          - Create a brief, clear title that captures the main topic or intent
          - Keep it under 60 characters
          - Use natural, readable language that reflects the biblical/spiritual nature of the conversation
          - Format as plain text without quotes or special characters
          - Respond with only the title, no other text
          `,
      },
      { role: "user", content: initialMessage },
    ],
  });

  const title = response.choices[0]?.message.content ?? "Untitled Chat";
  return await ctx.db.chatThread.update({
    where: { id: threadId },
    data: { title },
  });
}

type SendMessageOptions = {
  model?: ModelType;
};

async function* sendMessage(
  ctx: Context,
  threadId: string,
  messageContent?: string, // optional for when we want the assistant to respond without any user message
  options?: SendMessageOptions,
): AsyncGenerator<string> {
  await PermissionsService.validateChatThreadBelongsToUser(ctx, threadId);

  const threadWithMessages: ChatThreadWithMessages | null =
    await ctx.db.chatThread.findUnique({
      where: { id: threadId },
      include: { messages: true },
    });

  if (!threadWithMessages) {
    throw new Error("Thread not found");
  }

  let newUserMessage: ChatMessage | null = null;
  if (messageContent) {
    newUserMessage = await ctx.db.chatMessage.create({
      data: {
        role: "USER",
        content: messageContent,
        thread_id: threadId,
      },
    });
  }

  const allChatMessages = newUserMessage
    ? [...threadWithMessages.messages, newUserMessage]
    : threadWithMessages.messages;

  const chatMessages: ChatCompletionMessageParam[] = allChatMessages.map(
    (msg) => ({
      role: msg.role === "USER" ? "user" : "assistant",
      content: msg.content,
    }),
  );

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are Lumen, a friendly Christian AI assistant who helps users grow in their faith and understand Scripture. Think of yourself as a knowledgeable pastor who's having a casual conversation over coffee.

      Your communication style:
      - Warm, approachable, and conversational - use contractions, simple language, and occasional humor
      - Relatable and down-to-earth, like you're chatting with a friend
      - Occasionally use phrases like "you know," "I think," or "here's the thing" to sound more natural
      - While knowledgeable about Scripture, you explain complex concepts in simple terms
      
      When users ask questions:
      - For faith-related topics: Share insights in a friendly, encouraging tone with biblical grounding
      - For non-faith topics: Gently connect to spiritual aspects in a natural, non-preachy way
      
      Always aim to:
      - Weave Scripture naturally into conversation, like a pastor who knows just the right verse
      - Make biblical wisdom feel relevant and applicable to everyday life
      - Be encouraging and positive, offering hope and practical guidance
      - Use conversational language while maintaining respect for sacred topics
      
      Bible verse formatting:
      - Format references as "Book Chapter:Verse" (like "John 3:16")
      - For Psalms, use the full name "Psalms" 
      - Include the verse text with the reference in parentheses
      
      When users request resources:
      - Suggest helpful Christian content in a friendly way, like a pastor recommending their favorites
      - Include direct links and briefly explain why you think they'd be valuable
      - Focus on accessible, relatable resources that connect with everyday faith`,
    },
    ...chatMessages,
  ];

  const model = getModel(ctx, options?.model);

  const completion = await ctx.openai.chat.completions.create({
    model: model.model,
    messages,
    stream: true,
  });

  let content = "";
  try {
    for await (const chunk of completion) {
      const deltaContent = chunk.choices[0]?.delta.content ?? "";
      content += deltaContent;
      yield deltaContent;
    }
  } catch (error) {
    console.error(error);
  }

  await ctx.db.chatMessage.create({
    data: {
      role: "ASSISTANT",
      content,
      thread_id: threadId,
    },
  });
}

async function* sendMessageWithWebSearch(
  ctx: Context,
  threadId: string,
  messageContent?: string,
): AsyncGenerator<string> {
  await PermissionsService.validateChatThreadBelongsToUser(ctx, threadId);

  const threadWithMessages: ChatThreadWithMessages | null =
    await ctx.db.chatThread.findUnique({
      where: { id: threadId },
      include: { messages: true },
    });

  if (!threadWithMessages) {
    throw new Error("Thread not found");
  }

  let newUserMessage: ChatMessage | null = null;
  if (messageContent) {
    newUserMessage = await ctx.db.chatMessage.create({
      data: {
        role: "USER",
        content: messageContent,
        thread_id: threadId,
      },
    });
  }

  const allChatMessages = newUserMessage
    ? [...threadWithMessages.messages, newUserMessage]
    : threadWithMessages.messages;

  const chatMessages: ResponseInputItem[] = allChatMessages.map((msg) => ({
    role: msg.role === "USER" ? "user" : "assistant",
    content: msg.content,
  }));

  const messages: ResponseInputItem[] = [
    {
      role: "system",
      content: `You are Lumen, a Christian AI assistant dedicated to helping users grow in their faith and understand Scripture. Your primary focus is discussing the Bible, Christian theology, and matters of faith.

      When users ask questions:
      - For faith-related topics: Provide clear, biblically-grounded answers while maintaining a warm, encouraging tone
      - For non-faith topics: Gently redirect the conversation to relevant spiritual aspects or biblical principles that relate to their question
      
      Example re-directions:
      - If asked about career: Connect to biblical wisdom about work, purpose, and serving God
      - If asked about relationships: Reference biblical teachings on love, forgiveness, and community
      - If asked about general advice: Draw from Scripture and Christian principles

      Always aim to:
      - Ground responses in Scripture when possible
      - Share relevant Bible verses to support your points
      - Maintain a respectful, pastoral tone
      - Encourage spiritual growth and biblical understanding
      
      Bible verse formatting:
      - Always format Bible references as "Book Chapter:Verse" or "Book Chapter:Verse-Verse" for ranges
      - Examples: "John 3:16", "Psalms 23:1-6", "Genesis 1:1-3"
      - For Psalms, use the full name "Psalms" instead of "Psalm"
      - Use full book names, not abbreviations
      - Include the verse text followed by the reference in parentheses
      
      When users request resources:
      - Provide relevant links to sermons, YouTube videos, articles, or other Christian resources when requested
      - Include direct URLs to trustworthy Christian websites, ministries, or educational platforms
      - Format links clearly and explain why each resource might be helpful
      - Prioritize well-established, reputable Christian sources
      - When suggesting multiple resources, organize them by type (videos, articles, books, etc.)`,
    },
    ...chatMessages,
  ];

  const response = await ctx.openai.responses.create({
    model: "gpt-4o",
    tools: [{ type: "web_search_preview" }],
    input: messages,
    stream: true,
  });

  for await (const event of response) {
    if (event.type === "response.output_text.delta") {
      yield event.delta;
    } else if (event.type === "response.output_text.done") {
      await ctx.db.chatMessage.create({
        data: {
          role: "ASSISTANT",
          content: event.text,
          thread_id: threadId,
        },
      });
    }
  }
}

async function getThread(
  ctx: Context,
  threadId: string,
): Promise<ChatThreadWithMessages | null> {
  if (!ctx.user?.id) {
    throw new Error("User not found");
  }
  await PermissionsService.validateChatThreadBelongsToUser(ctx, threadId);

  return ctx.db.chatThread.findUnique({
    where: {
      id: threadId,
      user_id: ctx.user.id,
    },
    include: {
      messages: {
        orderBy: {
          created_at: "asc",
        },
      },
    },
  });
}

async function getUserThreads(
  ctx: Context,
  userId: string,
): Promise<ChatThread[]> {
  if (!ctx.user?.id) {
    throw new Error("User not found");
  }
  return ctx.db.chatThread.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export const ChatService = {
  createThread,
  sendMessage,
  sendMessageWithWebSearch,
  getThread,
  getUserThreads,
};

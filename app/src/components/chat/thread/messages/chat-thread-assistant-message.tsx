import "../../../../styles/chat-message.css";

import { type ChatMessage } from "@prisma/client";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import { bibleReferenceRegex } from "../../chat-utils";
import { ChatThreadMessage } from "../chat-thread-components";
import { ChatThreadAssistantMessageReferenceLink } from "./chat-thread-assistant-message-reference-link";
import SquareLogo from "../../../square-logo";
import { ExternalLink } from "lucide-react";

type Props = {
  message: ChatMessage;
  isStreaming: boolean;
};

export const ChatThreadAssistantMessage = memo(
  ChatThreadAssistantMessageImpl,
  (prev, next) => {
    return prev.message.content === next.message.content;
  },
);

function ChatThreadAssistantMessageImpl({ message, isStreaming }: Props) {
  if (message.content === "") {
    return null;
  }

  return (
    <ChatThreadMessage className="flex flex-col gap-2 bg-transparent px-0">
      <div className="flex">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border bg-muted/50 p-1.5">
            <SquareLogo className="size-4" size={16} shouldLink={false} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Lumen
          </span>
        </div>
      </div>
      <ReactMarkdown
        className="chat-message prose max-w-full leading-8"
        components={{
          p: ({ children }) => (
            <p>
              {React.Children.map(children, (child) => (
                <MarkdownText isStreaming={isStreaming}>{child}</MarkdownText>
              ))}
            </p>
          ),
          li: ({ children }) => (
            <li>
              {React.Children.map(children, (child) => (
                <MarkdownText isStreaming={isStreaming}>{child}</MarkdownText>
              ))}
            </li>
          ),
          h1: ({ children }) => (
            <h1>
              {React.Children.map(children, (child) => (
                <MarkdownText isStreaming={isStreaming}>{child}</MarkdownText>
              ))}
            </h1>
          ),
          h2: ({ children }) => (
            <h2>
              {React.Children.map(children, (child) => (
                <MarkdownText isStreaming={isStreaming}>{child}</MarkdownText>
              ))}
            </h2>
          ),
          h3: ({ children }) => (
            <h3>
              {React.Children.map(children, (child) => (
                <MarkdownText isStreaming={isStreaming}>{child}</MarkdownText>
              ))}
            </h3>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-black dark:text-secondary">
              {React.Children.map(children, (child) => (
                <MarkdownText isStreaming={isStreaming}>{child}</MarkdownText>
              ))}
            </strong>
          ),
          em: ({ children }) => (
            <em className="font-medium text-black dark:text-secondary">
              {React.Children.map(children, (child) => (
                <MarkdownText isStreaming={isStreaming}>{child}</MarkdownText>
              ))}
            </em>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400"
            >
              {children}
              <ExternalLink className="size-4" />
            </a>
          ),
          code: ({ children }) => (
            <div className="mt-2 overflow-x-auto rounded-md border bg-muted p-4 text-xs font-medium">
              {children}
            </div>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </ChatThreadMessage>
  );
}

const MarkdownText = memo(MarkdownTextImpl, (prev, next) => {
  return prev.children === next.children;
});

function MarkdownTextImpl({
  children,
  isStreaming,
}: {
  children: React.ReactNode;
  isStreaming: boolean;
}) {
  const textString = typeof children === "string" ? children : null;
  const parts = textString?.split(bibleReferenceRegex) ?? [];

  if (textString === null) {
    return children;
  }

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part !== "string") {
          return part;
        }

        const needsLeadingSpace = i > 0 && !parts[i - 1]?.match(/\s$/);
        if (part.match(bibleReferenceRegex)) {
          return (
            <React.Fragment key={i}>
              {needsLeadingSpace && " "}
              <ChatThreadAssistantMessageReferenceLink
                reference={part.trim()}
                isStreaming={isStreaming}
              />
            </React.Fragment>
          );
        }
        return part;
      })}
    </>
  );
}

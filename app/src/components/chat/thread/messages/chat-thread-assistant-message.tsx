import "../../../../styles/chat-message.css";

import { type ChatMessage } from "@prisma/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { parseBibleReferences } from "../../chat-utils";
import { ChatThreadMessage } from "../chat-thread-components";

type Props = {
  message: ChatMessage;
};

export default function ChatThreadAssistantMessage({ message }: Props) {
  if (message.content === "") {
    return null;
  }

  return (
    <div className="flex justify-start">
      <ChatThreadMessage className="bg-transparent">
        <ReactMarkdown
          className="chat-message prose max-w-full"
          components={{
            p: ({ children }) => (
              <p className="leading-8">
                {React.Children.map(children, (child) =>
                  typeof child === "string"
                    ? parseBibleReferences(child)
                    : child,
                )}
              </p>
            ),
            li: ({ children }) => (
              <li className="leading-8">
                {React.Children.map(children, (child) =>
                  typeof child === "string"
                    ? parseBibleReferences(child)
                    : child,
                )}
              </li>
            ),
            h1: ({ children }) => (
              <h1 className="leading-8">
                {React.Children.map(children, (child) =>
                  typeof child === "string"
                    ? parseBibleReferences(child)
                    : child,
                )}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="leading-8">
                {React.Children.map(children, (child) =>
                  typeof child === "string"
                    ? parseBibleReferences(child)
                    : child,
                )}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="leading-8">
                {React.Children.map(children, (child) =>
                  typeof child === "string"
                    ? parseBibleReferences(child)
                    : child,
                )}
              </h3>
            ),
            strong: ({ children }) => (
              <strong>
                {React.Children.map(children, (child) =>
                  typeof child === "string"
                    ? parseBibleReferences(child)
                    : child,
                )}
              </strong>
            ),
            em: ({ children }) => (
              <em>
                {React.Children.map(children, (child) =>
                  typeof child === "string"
                    ? parseBibleReferences(child)
                    : child,
                )}
              </em>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </ChatThreadMessage>
    </div>
  );
}

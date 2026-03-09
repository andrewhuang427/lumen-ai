"use client";

import { useSyncExternalStore } from "react";

type ChatStreamState = {
  threadIdToStreamingMessage: Record<string, string>;
  isStreaming: Record<string, boolean>;
};

type Listener = () => void;

let state: ChatStreamState = {
  threadIdToStreamingMessage: {},
  isStreaming: {},
};

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(updater: (previousState: ChatStreamState) => ChatStreamState) {
  state = updater(state);
  emitChange();
}

export const chatStreamStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getState() {
    return state;
  },
  startStreaming(threadId: string) {
    setState((previousState) => ({
      isStreaming: {
        ...previousState.isStreaming,
        [threadId]: true,
      },
      threadIdToStreamingMessage: {
        ...previousState.threadIdToStreamingMessage,
        [threadId]: "",
      },
    }));
  },
  appendToken(threadId: string, token: string) {
    setState((previousState) => ({
      ...previousState,
      threadIdToStreamingMessage: {
        ...previousState.threadIdToStreamingMessage,
        [threadId]:
          (previousState.threadIdToStreamingMessage[threadId] ?? "") + token,
      },
    }));
  },
  clearStreaming(threadId: string) {
    setState((previousState) => {
      const nextStreamingMessages = {
        ...previousState.threadIdToStreamingMessage,
      };
      const nextIsStreaming = { ...previousState.isStreaming };

      delete nextStreamingMessages[threadId];
      delete nextIsStreaming[threadId];

      return {
        threadIdToStreamingMessage: nextStreamingMessages,
        isStreaming: nextIsStreaming,
      };
    });
  },
};

export function useChatStreamStore() {
  return useSyncExternalStore(
    (listener) => chatStreamStore.subscribe(listener),
    () => chatStreamStore.getState(),
    () => chatStreamStore.getState(),
  );
}

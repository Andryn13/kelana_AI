"use client";

import { useEffect, useRef, useState } from "react";

import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "@/services/conversationService";

type Conversation = {
  id: number;
  title: string;
  created_at: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversationTitle, setConversationTitle] =
    useState("New Conversation");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingConversations(false);
    }
  }

  async function startNewConversation() {
    try {
      const data = await createConversation();

      setConversationId(data.conversation_id);
      setConversationTitle("New Conversation");
      setMessages([]);

      await loadConversations();
    } catch (error) {
      console.error(error);
    }
  }

  async function openConversation(id: number) {
    try {
      setConversationId(id);

      const selectedConversation = conversations.find(
        (conversation) => conversation.id === id
      );

      if (selectedConversation) {
        setConversationTitle(selectedConversation.title);
      }

      const data = await getMessages(id);

      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) {
      return;
    }

    let activeConversationId = conversationId;

    try {
      setLoading(true);

      if (!activeConversationId) {
        const newConversation = await createConversation();

        activeConversationId =
          newConversation.conversation_id;

        setConversationId(activeConversationId);
        setConversationTitle("New Conversation");

        await loadConversations();
      }

      const userText = input.trim();

      setInput("");

      const temporaryUserMessage: Message = {
        id: Date.now(),
        role: "user",
        content: userText,
        created_at: new Date().toISOString(),
      };

      setMessages((previous) => [
        ...previous,
        temporaryUserMessage,
      ]);

      if (activeConversationId === null) {
        return;
        }

      const response = await sendMessage(
        activeConversationId,
        userText
      );

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.answer,
        created_at: new Date().toISOString(),
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      await loadConversations();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  function formatTimestamp(timestamp: string) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex h-[85vh] max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg">

        {/* ==================== */}
        {/* Conversation Sidebar */}
        {/* ==================== */}

        <aside className="flex w-72 flex-col border-r border-slate-200 bg-slate-50">

          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h1 className="font-semibold text-slate-900">
              Conversations
            </h1>

            <button
              onClick={startNewConversation}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              +
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <p className="p-4 text-sm text-slate-600">
                Loading...
              </p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-slate-600">
                No conversations yet.
              </p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() =>
                    openConversation(conversation.id)
                  }
                  className={`w-full border-b border-slate-200 px-4 py-3 text-left hover:bg-slate-100 ${
                    conversationId === conversation.id
                      ? "bg-slate-200"
                      : ""
                  }`}
                >
                  <p className="truncate text-sm font-medium text-slate-900">
                    {conversation.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {new Date(
                      conversation.created_at
                    ).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ==================== */}
        {/* Chat Area */}
        {/* ==================== */}

        <section className="flex flex-1 flex-col">

          <header className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">
              {conversationTitle}
            </h2>

            <p className="text-sm text-slate-600">
              KelanaAI Travel Assistant
            </p>
          </header>

          {/* ==================== */}
          {/* Messages */}
          {/* ==================== */}

          <div className="flex-1 space-y-4 overflow-y-auto p-6">

            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Start a conversation
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Ask KelanaAI about your next adventure.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </p>

                    <p
                      className={`mt-2 text-right text-xs ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-slate-500"
                      }`}
                    >
                      {formatTimestamp(
                        message.created_at
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                  <span className="animate-pulse">
                    KelanaAI is typing...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ==================== */}
          {/* Input */}
          {/* ==================== */}

          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-3">

              <input
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500"
              />

              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>

            </div>
          </div>

        </section>
      </div>
    </main>
  );
}
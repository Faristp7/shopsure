'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Loader2, RotateCcw } from 'lucide-react';
import { streamChat, type ChatMessage } from '@/services/ai-chat.service';

interface Message extends ChatMessage {
  id: string;
  streaming?: boolean;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 h-4">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I can help you find products. Ask me anything!',
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function buildHistory(msgs: Message[]): ChatMessage[] {
    return msgs
      .filter((m) => m.id !== 'welcome')
      .map(({ role, content }) => ({ role, content }));
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;

    setError(null);
    setInput('');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
    };

    const assistantId = `a-${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    const history = buildHistory([...messages, userMsg]);

    abortRef.current = new AbortController();

    await streamChat(
      history,
      (token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + token } : m
          )
        );
      },
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
        setStreaming(false);
      },
      (err) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'Something went wrong. Please try again.', streaming: false }
              : m
          )
        );
        setError(err.message);
        setStreaming(false);
      },
      abortRef.current.signal
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hi! I can help you find products. Ask me anything!',
      },
    ]);
    setInput('');
    setStreaming(false);
    setError(null);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className={`relative p-2 rounded-lg transition-colors shrink-0 ${
          open
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-secondary text-foreground'
        }`}
      >
        <Bot className="w-5 h-5" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-[200] w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-primary text-primary-foreground">
            <Bot className="w-5 h-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none">ShopSure AI</p>
              <p className="text-xs opacity-80 mt-0.5">Ask about any product</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                title="Clear chat"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary text-foreground rounded-tl-sm'
                  }`}
                >
                  {msg.content || (msg.streaming ? <TypingDots /> : null)}
                  {msg.streaming && msg.content && (
                    <span className="inline-block w-0.5 h-3.5 bg-current opacity-70 ml-0.5 animate-pulse align-text-bottom" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Error */}
          {error && (
            <p className="px-4 pb-1 text-xs text-destructive">{error}</p>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products..."
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none bg-secondary text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground max-h-24 leading-relaxed disabled:opacity-60"
              style={{ height: 'auto', minHeight: '2.5rem' }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {streaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

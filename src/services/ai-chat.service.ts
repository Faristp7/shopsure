export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/';

export async function streamChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
  signal?: AbortSignal
): Promise<void> {
  const url = `${BASE_URL.replace(/\/$/, '')}/v1/ai-search/chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      credentials: 'include',
      body: JSON.stringify({ messages }),
      signal,
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(payload);
          if (typeof parsed.token === 'string') onToken(parsed.token);
        } catch {
          // skip malformed lines
        }
      }
    }

    onDone();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}

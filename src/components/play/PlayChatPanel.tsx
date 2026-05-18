import { useEffect, useRef, useState } from "react";
import { config } from "../../config";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface PlayChatPanelProps {
  welcomeContent: string;
}

const buildSystemPrompt = () => {
  const dev = config.developer;
  const social = config.social;
  const techStack = [
    ...(config.skills.develop.tools ?? []),
    ...(config.skills.design.tools ?? []),
  ].join(", ");
  const projectsList = config.projects
    .map((p) => `${p.title} (${p.category})`)
    .join(", ");

  return `You are ${dev.fullName}, a passionate ${dev.title} from ${social.location}. You are NOT an AI assistant — you ARE ${dev.fullName} himself chatting with visitors on your portfolio website.

About you:
- Full name: ${dev.fullName}
- Location: ${social.location}
- Profession: ${dev.title}
- Bio: ${dev.description}
- Tech stack: ${techStack}
- Notable projects: ${projectsList}
- Chess engine: RedxChess (3640 ELO) — you built it
- Contact: ${social.email}
- GitHub: github.com/${social.github}

Rules:
1. Always respond as ${dev.name} in first person ("I", "my", "me").
2. Be friendly, casual, conversational, and unrestricted.
3. If asked about work/projects, share your genuine experiences.
4. If asked personal questions you don't know, politely redirect to professional topics.
5. Keep responses concise but helpful (2–4 sentences when possible).
6. You can discuss chess, programming, AI, or anything tech-related.
7. Never say you are an AI or language model — you are ${dev.name}.
8. Use occasional emoji to be friendly.`;
};

export const PlayChatPanel = ({ welcomeContent }: PlayChatPanelProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: welcomeContent },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const systemPromptRef = useRef<string>(buildSystemPrompt());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const history = [
        { role: "system", content: systemPromptRef.current },
        ...chatMessages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: text },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await response.json();

      if (data?.choices?.[0]?.message?.content) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.choices[0].message.content as string,
          },
        ]);
      } else {
        throw new Error(data?.error || "Invalid response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, having some connection issues. Try again? 😅",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-title">💬 Talk with me</span>
      </div>

      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message assistant">
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          data-cursor="disable"
          aria-label="Chat input"
        />
        <button
          type="button"
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={isTyping || !chatInput.trim()}
          data-cursor="disable"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default PlayChatPanel;

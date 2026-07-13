"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const MODELS = [
  { id: "native-minimax/MiniMax-M3", name: "🟣 Native MiniMax-M3 (Anthropic API)" },
  { id: "native-minimax/MiniMax-M2.7", name: "🟣 Native MiniMax-M2.7 (Anthropic API)" },
  { id: "minimax/minimax-m2.7", name: "🚀 MiniMax M2.7" },
  { id: "minimax/minimax-m3", name: "🚀 MiniMax M3 (Default)" },
  { id: "openai/gpt-4o", name: "🧠 GPT-4o" },
  { id: "openai/gpt-4.1", name: "🧠 GPT-4.1" },
  { id: "google/gemini-2.5-pro", name: "✨ Gemini 2.5 Pro" },
  { id: "google/gemini-2.5-flash", name: "✨ Gemini 2.5 Flash" },
  { id: "deepseek/deepseek-v4-flash", name: "🔬 DeepSeek V4 Flash" },
  { id: "x-ai/grok-3", name: "⚡ Grok 3" },
  { id: "poolside/laguna-xs-2.1:free", name: "🌊 Laguna XS 2.1 (free)" },
  { id: "openai/gpt-oss-120b:free", name: "🤖 GPT-OSS 120B (free)" },
  { id: "openai/gpt-oss-20b:free", name: "🤖 GPT-OSS 20B (free)" },
  { id: "google/gemma-4-31b-it:free", name: "✨ Gemma 4 31B (free)" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "🟢 Nemotron 3 Nano Omni (free)" },
  // { id: "ollama/llama3.1", name: "💻 Local: Llama 3.1 (8B)" },
  // { id: "ollama/qwen2.5:14b", name: "💻 Local: Qwen 2.5 (14B - Requires DL)" },
  // { id: "ollama/qwen2.5", name: "💻 Local: Qwen 2.5 (7B)" },
  // { id: "lmstudio/local-model", name: "🚀 LM Studio (Currently Loaded Model)" },
  { id: "nvidia/nemotron-3-ultra-550b-a55b:free", name: "🟢 Nemotron 3 Ultra Omni (free)" }
];

export default function Home() {
  const [selectedModel, setSelectedModel] = React.useState(MODELS[8].id);
  const selectedModelRef = React.useRef(selectedModel);
  React.useEffect(() => { selectedModelRef.current = selectedModel; }, [selectedModel]);
  React.useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      if (typeof input === "string" && input.startsWith("/api/chat")) {
        try {
          const parsedBody = JSON.parse((init?.body as string) || "{}");
          parsedBody.model = selectedModelRef.current;
          init = { ...init, body: JSON.stringify(parsedBody) };
        } catch (e) {
          console.error("Failed to intercept fetch body", e);
        }
      }
      return originalFetch(input, init);
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = React.useState("");
  const isLoading = status === "submitted" || status === "streaming";
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const getMessageText = (m: any) => {
    if (typeof m.content === "string") return m.content;
    if (typeof m.text === "string") return m.text;
    if (Array.isArray(m.parts)) {
      return m.parts.map((p: any) => p.text || "").join("");
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] font-sans transition-colors duration-200 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
      {/* Header */}
      <header className={`flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 gap-3 md:gap-0 border-b shadow-sm transition-colors duration-200 ${isDark ? "bg-transparent border-gray-800" : "bg-transparent border-gray-200"}`}>
        <h1 className={`text-xl font-bold tracking-tight w-full md:w-auto text-center md:text-left flex justify-center md:justify-start items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          OOH <span className="text-primary">AI Agent</span>
        </h1>
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={`text-sm font-medium px-2 py-2 md:px-4 rounded-lg cursor-pointer outline-none transition-colors duration-200 flex-1 md:flex-none w-[60%] md:w-auto max-w-full text-ellipsis overflow-hidden whitespace-nowrap ${isDark ? "bg-[#2a2b36] hover:bg-gray-700 text-white border border-gray-700 focus:border-primary" : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 focus:border-primary"}`}
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">
          {(messages || []).length === 0 && (
            <div className="space-y-4 mt-6">
              <div className={`p-4 rounded-xl rounded-tl-sm w-fit max-w-[80%] shadow-sm ${isDark ? "bg-[#2a2b36]" : "bg-white border border-gray-200"}`}>
                <p className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Welcome back! 👋</p>
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>What would you like to query today?</p>
              </div>
              {/* <div className="flex gap-3 flex-wrap">
                {["Get Bookings", "View Students", "Check Schema"].map((action) => (
                  <button
                    key={action}
                    onClick={() => setInput(action)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                  >
                    <span>+</span> {action}
                  </button>
                ))}
              </div> */}
            </div>
          )}

          {(messages || []).map((m: any) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[95%] md:max-w-[85%] p-3 md:p-4 shadow-sm w-full md:w-auto ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm w-auto"
                    : isDark 
                      ? "bg-[#2a2b36] text-gray-200 rounded-2xl rounded-tl-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm"
                }`}
              >
                {m.role === "user" ? (
                  <div className="whitespace-pre-wrap">{getMessageText(m)}</div>
                ) : (
                  <div className={`prose prose-sm md:prose-base max-w-none prose-tables:w-full prose-tables:border-collapse prose-td:border prose-td:p-2 prose-th:border prose-th:p-2 overflow-x-auto ${isDark ? "prose-invert prose-td:border-gray-600 prose-th:border-gray-600 prose-th:bg-gray-800" : "prose-td:border-gray-200 prose-th:border-gray-200 prose-th:bg-gray-100"}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {getMessageText(m)}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2 ${isDark ? "bg-[#2a2b36]" : "bg-white border border-gray-200"}`}>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className={`p-3 md:p-4 border-t flex justify-center transition-colors duration-200 ${isDark ? "bg-transparent border-gray-800" : "bg-transparent border-gray-200"}`}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 md:gap-3 w-full max-w-4xl">
          <button type="button" className={`p-2 md:p-3 rounded-lg transition-colors flex-shrink-0 ${isDark ? "bg-[#2a2b36] hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}>
            <span className="text-xl leading-none">+</span>
          </button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className={`flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary transition-colors w-0 ${isDark ? "bg-[#2a2b36] text-white placeholder-gray-400" : "bg-gray-100 text-gray-900 placeholder-gray-500 border border-transparent focus:border-primary"}`}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="px-4 md:px-6 py-2 md:py-3 flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

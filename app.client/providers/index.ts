import { createOpenAI } from "@ai-sdk/openai";

import { createAnthropic } from "@ai-sdk/anthropic";
import { createOllama } from "ai-sdk-ollama";

const ollama = createOllama({
  baseURL: "http://localhost:11434",
});

const lmstudio = createOpenAI({
  baseURL: "http://localhost:1234/v1",
  apiKey: "not-needed", // LM Studio doesn't require an API key
});

function getOpenRouterProvider(apiKeyOverride?: string) {
  const apiKey = apiKeyOverride || process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === "your_openrouter_api_key_here" || apiKey.trim() === "") {
    throw new Error(
      "[OpenRouter] OPENROUTER_API_KEY is not set in your .env file."
    );
  }

  return createOpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

function getMinimaxProvider() {
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey || apiKey === "your_minimax_api_key_here" || apiKey.trim() === "") {
    throw new Error(
      "[MiniMax] MINIMAX_API_KEY is not set in your .env file."
    );
  }

  return createOpenAI({
    apiKey,
    baseURL: "https://api.minimax.io/v1",
  });
}

export function getModel(modelId?: string, apiKeyOverride?: string) {
  const resolvedModel = modelId || process.env.DEFAULT_MODEL || "anthropic/claude-opus-4";
  
  if (resolvedModel.startsWith("native-minimax/")) {
    const localModelName = resolvedModel.replace("native-minimax/", "");
    const provider = getMinimaxProvider();
    return provider.chat(localModelName);
  }
  
  if (resolvedModel.startsWith("ollama/")) {
    const localModelName = resolvedModel.replace("ollama/", "");
    return ollama(localModelName);
  }
  
  if (resolvedModel.startsWith("lmstudio/")) {
    const localModelName = resolvedModel.replace("lmstudio/", "");
    return lmstudio.chat(localModelName);
  }
  
  const provider = getOpenRouterProvider(apiKeyOverride);
  return provider.chat(resolvedModel);
}

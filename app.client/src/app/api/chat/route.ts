import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { getModel } from "../../../../providers";
import { getMcpTools } from "../../../../mcp/client";

export const maxDuration = 60; 

const SYSTEM_PROMPT = `You are an AI assistant built for an Out Of Home (OOH) application. 
Your goal is to help the user retrieve information specifically from two document-related tables in the PostgreSQL database.

You have access to MCP tools:
- get_database_schema: Use this to understand what columns exist in the document tables.
- execute_sql_query: Use this to execute a SELECT query and get data.

CRITICAL DATABASE RULES:
1. YOU MUST ONLY QUERY THE FOLLOWING TWO TABLES: \`document_url\` (parent table) and \`document_url_text\` (child table).
2. DO NOT query any other tables in the database.
3. The parent table \`document_url\` contains metadata like \`document_file_name\`, \`category\`, \`blob_url\`, etc.
4. The child table \`document_url_text\` contains \`page_num\` (the page number) and \`text\` (the content of the document).
5. If the user asks about the content of a document, join these tables or query \`document_url_text\`.

CRITICAL TOKEN SAVING RULES (MUST FOLLOW):
1. ALWAYS append \`LIMIT 10\` to every single SQL query. Never fetch more than 10 rows at a time.
2. If the user asks for data, only query the specific tables needed. 
3. Present the results clearly using beautifully formatted Markdown tables.
4. DO NOT display or explain the SQL query itself in your final response.
5. DO NOT output your internal thought process, reasoning, or <think> tags. Only output the final answer or data directly.
6. When displaying a document in the table, ALWAYS format it as a clickable Markdown hyperlink using the \`blob_url\` column as the URL (e.g., \`(https://example.com/blob/doc_xyz.pdf)\`). Do not just show the plain file name.

CRITICAL: You must use the native tool calling functionality to invoke tools. DO NOT output raw JSON or tool names in your regular text response.
IMPORTANT: The database strings are often uppercase. When querying for strings like names, ALWAYS use case-insensitive matching (e.g. \`ILIKE '%Jon%'\`).`;

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const tools = await getMcpTools();

    // Normalize messages to ensure content is set and toolInvocations are preserved
    const normalizedMessages = messages.map((m: any) => {
      let content = m.content;
      if (typeof content !== "string") {
        if (typeof m.text === "string") content = m.text;
        else if (Array.isArray(m.parts)) {
          content = m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join("");
        }
      }
      return {
        ...m,
        content: content || "",
      };
    });

    const coreMessages = await convertToModelMessages(normalizedMessages);

    const result = streamText({
      model: getModel(model),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      tools,
      maxRetries: 2,
      maxSteps: 5,
      stopWhen: stepCountIs(5),
      onFinish: (event) => {
        console.log(`\n📊 [Token Usage] Model: ${model}`);
        console.log(`Input (Prompt) Tokens : ${event.usage.inputTokens}`);
        console.log(`Output (Completion)   : ${event.usage.outputTokens}`);
        console.log(`Total Tokens Used     : ${event.usage.totalTokens}\n`);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[API Error]:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

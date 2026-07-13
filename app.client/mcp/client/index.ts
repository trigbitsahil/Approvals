import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { tool } from "ai";
import { z } from "zod";
import path from "path";

// Initialize the MCP Client
let mcpClient: Client | null = null;

async function getClient() {
  if (mcpClient) return mcpClient;

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", path.resolve(process.cwd(), "mcp/server/index.ts")],
    env: {
      ...process.env,
      PATH: process.env.PATH as string,
    } as Record<string, string>,
  });

  mcpClient = new Client(
    { name: "ooh-agent-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await mcpClient.connect(transport);
  return mcpClient;
}

export async function getMcpTools() {
  const client = await getClient();
  const toolsList = await client.listTools();

  const aiTools: Record<string, any> = {};

  for (const t of toolsList.tools) {
    if (t.name === "get_database_schema") {
      aiTools[t.name] = tool({
        description: t.description,
        parameters: z.object({}),
        execute: async (args: any) => {
          const result = await client.callTool({
            name: t.name,
            arguments: {},
          });
          return (result as any).content[0].text;
        },
      } as any);
    }

    if (t.name === "execute_sql_query") {
      aiTools[t.name] = tool({
        description: t.description,
        parameters: z.object({
          query: z.string().optional().describe("The SQL SELECT query to execute"),
          sql: z.string().optional().describe("Fallback for the SQL query"),
        }),
        execute: async (args: any) => {
          // Normalize arguments since local LLMs often hallucinate 'sql' instead of 'query'
          const actualQuery = args.query || args.sql;
          if (!actualQuery) {
            return "Error: You must provide a 'query' parameter containing the SQL statement.";
          }
          
          const result = await client.callTool({
            name: t.name,
            arguments: { query: actualQuery },
          });
          return (result as any).content[0].text;
        },
      } as any);
    }
  }

  return aiTools;
}

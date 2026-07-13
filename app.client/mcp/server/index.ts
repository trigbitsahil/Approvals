import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import pg from 'pg';

const { Pool } = pg;

// Connect to identity_db as per previous context
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const server = new Server(
  {
    name: "ooh-agent-postgres",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_database_schema",
        description: "Returns the schema of the public tables in the database, including column names and data types. Use this to understand what you can query.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "execute_sql_query",
        description: "Executes a SELECT SQL query on the PostgreSQL database and returns the results. Do NOT run UPDATE/INSERT/DELETE queries.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The SQL SELECT query to execute.",
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_database_schema") {
      const res = await pool.query(`
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      `);
      return {
        content: [{ type: "text", text: JSON.stringify(res.rows, null, 2) }],
      };
    }

    if (name === "execute_sql_query") {
      const query = (args as any).query;
      
      if (!query.toLowerCase().trim().startsWith('select')) {
        throw new Error("Only SELECT queries are allowed.");
      }

      const res = await pool.query(query);
      return {
        content: [{ type: "text", text: JSON.stringify(res.rows, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch(console.error);

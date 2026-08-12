import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools/index.js";
import { prompts } from "./prompts/index.js";
import { resources } from "./resources/index.js";

const server = new Server(
  {
    name: "mcp-server-calendar",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
      resources: {},
    },
  }
);

// --- Registro de Tools ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = tools.find(t => t.name === request.params.name);
  if (!tool) {
    throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${request.params.name}`);
  }

  try {
    return await tool.handler(request.params.arguments || {});
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error en la ejecución de la herramienta: ${(error as Error).message}` }],
      isError: true,
    };
  }
});

// --- Registro de Prompts ---
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: prompts.map(prompt => ({
      name: prompt.name,
      description: prompt.description,
      arguments: prompt.arguments,
    })),
  };
});

// --- Registro de Resources ---
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: resources.map(resource => ({
      uri: resource.uri,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
    })),
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Servidor MCP Google Calendar ejecutándose en stdio');
}

main().catch(console.error);

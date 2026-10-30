#!/usr/bin/env node

/**
 * SJify Model Context Protocol (MCP) Server
 * Connects Claude Desktop, Cursor, and LLM Agents to the SJify Web Platform.
 */

import readline from 'readline';

const API_BASE = process.env.SJIFY_API_URL || 'http://localhost:4000';
const API_TOKEN = process.env.SJIFY_API_TOKEN || '';

const TOOLS = [
  {
    name: 'search_actors',
    description: 'Search available scraping and automation actors in the SJify Store marketplace.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords, e.g. "google maps", "e-commerce", "instagram"' },
        category: { type: 'string', description: 'Optional category filter' },
      },
    },
  },
  {
    name: 'call_actor',
    description: 'Trigger a containerized scraper Actor on SJify with custom input parameters.',
    inputSchema: {
      type: 'object',
      properties: {
        actorId: { type: 'string', description: 'Actor slug or ID (e.g. "website-content-crawler")' },
        input: { type: 'object', description: 'Input dictionary (e.g. { startUrls: [{ url: "https://..." }] })' },
      },
      required: ['actorId'],
    },
  },
  {
    name: 'get_actor_run',
    description: 'Check run execution status, duration, compute units consumed, and defaultDatasetId.',
    inputSchema: {
      type: 'object',
      properties: {
        runId: { type: 'string', description: 'Unique Run ID returned when the actor was called' },
      },
      required: ['runId'],
    },
  },
  {
    name: 'get_dataset_items',
    description: 'Retrieve structured scraped data records from a SJify dataset.',
    inputSchema: {
      type: 'object',
      properties: {
        datasetId: { type: 'string', description: 'Dataset ID to fetch records from' },
        limit: { type: 'number', description: 'Maximum number of items to return (default 50)' },
        offset: { type: 'number', description: 'Pagination offset' },
      },
      required: ['datasetId'],
    },
  },
  {
    name: 'abort_run',
    description: 'Gracefully abort an active containerized run on SJify.',
    inputSchema: {
      type: 'object',
      properties: {
        runId: { type: 'string', description: 'Run ID to terminate' },
      },
      required: ['runId'],
    },
  },
];

async function callSjifyApi(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return res.json();
}

async function handleToolCall(name: string, args: Record<string, any>) {
  try {
    switch (name) {
      case 'search_actors': {
        const data = await callSjifyApi('/v1/acts/store');
        const items = data.actors || [];
        const filtered = args.query
          ? items.filter((a: any) =>
              (a.title + ' ' + a.description + ' ' + a.slug)
                .toLowerCase()
                .includes(args.query.toLowerCase())
            )
          : items;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ count: filtered.length, actors: filtered }, null, 2),
            },
          ],
        };
      }

      case 'call_actor': {
        const runRes = await callSjifyApi(`/v1/acts/${args.actorId}/runs`, {
          method: 'POST',
          body: JSON.stringify({ input: args.input || {} }),
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: 'Actor run triggered successfully on SJify',
                  run: runRes.run || runRes,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_actor_run': {
        const run = await callSjifyApi(`/v1/actor-runs/${args.runId}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(run, null, 2),
            },
          ],
        };
      }

      case 'get_dataset_items': {
        const queryParams = new URLSearchParams();
        if (args.limit) queryParams.set('limit', String(args.limit));
        if (args.offset) queryParams.set('offset', String(args.offset));

        const items = await callSjifyApi(
          `/v1/datasets/${args.datasetId}/items?${queryParams.toString()}`
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(items, null, 2),
            },
          ],
        };
      }

      case 'abort_run': {
        const abortRes = await callSjifyApi(`/v1/actor-runs/${args.runId}/abort`, {
          method: 'POST',
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(abortRes, null, 2),
            },
          ],
        };
      }

      default:
        return {
          isError: true,
          content: [{ type: 'text', text: `Unknown tool name: ${name}` }],
        };
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: 'text', text: `API Request Error: ${error.message || String(error)}` }],
    };
  }
}

function sendResponse(id: any, result: any, error?: any) {
  const response: Record<string, any> = {
    jsonrpc: '2.0',
    id,
  };

  if (error) {
    response.error = error;
  } else {
    response.result = result;
  }

  process.stdout.write(JSON.stringify(response) + '\n');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const msg = JSON.parse(trimmed);

    // Protocol Handshake
    if (msg.method === 'initialize') {
      sendResponse(msg.id, {
        protocolVersion: '2024-11-05',
        serverInfo: {
          name: 'sjify-mcp',
          version: '1.0.0',
        },
        capabilities: {
          tools: {},
        },
      });
      return;
    }

    if (msg.method === 'notifications/initialized') {
      return;
    }

    if (msg.method === 'ping') {
      sendResponse(msg.id, {});
      return;
    }

    // Tools discovery
    if (msg.method === 'tools/list') {
      sendResponse(msg.id, {
        tools: TOOLS,
      });
      return;
    }

    // Tool execution
    if (msg.method === 'tools/call') {
      const toolName = msg.params?.name;
      const toolArgs = msg.params?.arguments || {};
      const result = await handleToolCall(toolName, toolArgs);
      sendResponse(msg.id, result);
      return;
    }

    // Fallback for unknown methods
    if (msg.id !== undefined) {
      sendResponse(msg.id, null, {
        code: -32601,
        message: `Method not found: ${msg.method}`,
      });
    }
  } catch (err: any) {
    process.stderr.write(`Failed to parse line: ${err.message}\n`);
  }
});

process.stderr.write('[SJify MCP Server] Stdio server initialized.\n');

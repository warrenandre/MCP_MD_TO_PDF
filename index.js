#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium } from 'playwright';
import { marked } from 'marked';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create server instance
const server = new Server(
  {
    name: "pdf-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Default CSS for PDF styling
const DEFAULT_CSS = `
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
h3 { font-size: 1.25em; }

code {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

pre {
  background-color: #f6f8fa;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

pre code {
  background-color: transparent;
  padding: 0;
}

blockquote {
  border-left: 4px solid #ddd;
  margin: 1em 0;
  padding-left: 1em;
  color: #666;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.5em;
  text-align: left;
}

th {
  background-color: #f6f8fa;
  font-weight: 600;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: #0366d6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ul, ol {
  padding-left: 2em;
}

@media print {
  body {
    max-width: none;
  }
}
`;

// Convert markdown to HTML
async function markdownToHtml(markdownContent, customCss = '') {
  const htmlContent = await marked(markdownContent);
  const css = customCss || DEFAULT_CSS;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${css}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `;
}

// Convert HTML to PDF using Playwright
async function htmlToPdf(html, outputPath, options = {}) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setContent(html);
  
  const pdfOptions = {
    path: outputPath,
    format: options.format || 'A4',
    printBackground: options.printBackground !== false,
    margin: options.margin || {
      top: '1cm',
      right: '1cm',
      bottom: '1cm',
      left: '1cm'
    },
    ...options
  };
  
  await page.pdf(pdfOptions);
  await browser.close();
  
  return outputPath;
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "convert_markdown_to_pdf",
        description: "Convert a Markdown file to PDF using Playwright. Supports custom CSS styling and PDF options.",
        inputSchema: {
          type: "object",
          properties: {
            markdownPath: {
              type: "string",
              description: "Path to the input Markdown file"
            },
            outputPath: {
              type: "string",
              description: "Path where the PDF should be saved"
            },
            customCss: {
              type: "string",
              description: "Optional custom CSS to style the PDF (overrides default styling)"
            },
            format: {
              type: "string",
              description: "Paper format (e.g., 'A4', 'Letter', 'Legal'). Default: 'A4'",
              enum: ["A4", "Letter", "Legal", "A3", "A5", "Tabloid"]
            },
            landscape: {
              type: "boolean",
              description: "Use landscape orientation. Default: false"
            },
            printBackground: {
              type: "boolean",
              description: "Print background graphics. Default: true"
            }
          },
          required: ["markdownPath", "outputPath"]
        }
      },
      {
        name: "convert_markdown_content_to_pdf",
        description: "Convert Markdown content (string) directly to PDF without reading from a file.",
        inputSchema: {
          type: "object",
          properties: {
            markdownContent: {
              type: "string",
              description: "The Markdown content to convert"
            },
            outputPath: {
              type: "string",
              description: "Path where the PDF should be saved"
            },
            customCss: {
              type: "string",
              description: "Optional custom CSS to style the PDF"
            },
            format: {
              type: "string",
              description: "Paper format (e.g., 'A4', 'Letter', 'Legal'). Default: 'A4'",
              enum: ["A4", "Letter", "Legal", "A3", "A5", "Tabloid"]
            },
            landscape: {
              type: "boolean",
              description: "Use landscape orientation. Default: false"
            },
            printBackground: {
              type: "boolean",
              description: "Print background graphics. Default: true"
            }
          },
          required: ["markdownContent", "outputPath"]
        }
      },
      {
        name: "get_default_css",
        description: "Get the default CSS template used for styling PDFs. Useful for customizing styles.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "convert_markdown_to_pdf") {
      const { markdownPath, outputPath, customCss, format, landscape, printBackground } = args;
      
      // Read markdown file
      const markdownContent = await readFile(resolve(markdownPath), 'utf-8');
      
      // Convert to HTML
      const html = await markdownToHtml(markdownContent, customCss);
      
      // Convert to PDF
      const pdfOptions = {
        format: format || 'A4',
        landscape: landscape || false,
        printBackground: printBackground !== false
      };
      
      const result = await htmlToPdf(html, resolve(outputPath), pdfOptions);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully converted Markdown to PDF!\n\nInput: ${markdownPath}\nOutput: ${result}\nFormat: ${pdfOptions.format}\nOrientation: ${pdfOptions.landscape ? 'Landscape' : 'Portrait'}`
          }
        ]
      };
    }
    
    if (name === "convert_markdown_content_to_pdf") {
      const { markdownContent, outputPath, customCss, format, landscape, printBackground } = args;
      
      // Convert to HTML
      const html = await markdownToHtml(markdownContent, customCss);
      
      // Convert to PDF
      const pdfOptions = {
        format: format || 'A4',
        landscape: landscape || false,
        printBackground: printBackground !== false
      };
      
      const result = await htmlToPdf(html, resolve(outputPath), pdfOptions);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully converted Markdown content to PDF!\n\nOutput: ${result}\nFormat: ${pdfOptions.format}\nOrientation: ${pdfOptions.landscape ? 'Landscape' : 'Portrait'}\nContent length: ${markdownContent.length} characters`
          }
        ]
      };
    }
    
    if (name === "get_default_css") {
      return {
        content: [
          {
            type: "text",
            text: `Default CSS Template:\n\n${DEFAULT_CSS}\n\nYou can use this as a starting point for customization.`
          }
        ]
      };
    }
    
    throw new Error(`Unknown tool: ${name}`);
    
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PDF MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

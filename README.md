# Markdown to PDF MCP Server

A **Model Context Protocol (MCP) server** that enables AI assistants like Claude to convert Markdown files and content to beautifully formatted PDF documents. Built with Node.js and Playwright for high-quality, browser-based PDF generation.

## What is This?

This MCP server adds PDF conversion capabilities to Claude Desktop and other MCP-compatible AI assistants. Simply ask Claude to "convert my markdown file to PDF" and it handles the conversion using this server.

## Features

- 🎨 **Beautiful Defaults**: GitHub-style markdown rendering out of the box
- 🎯 **Custom Styling**: Full control with custom CSS
- 📄 **Multiple Formats**: Support for A4, Letter, Legal, and more
- 🔄 **Flexible Input**: Convert from files or direct markdown content
- 🖨️ **Print Options**: Landscape/portrait, margins, background graphics
- ⚡ **Fast**: Powered by Playwright's Chromium engine

## Installation

You can use this MCP server in two ways:

### Option 1: Use Directly from GitHub (Recommended)

**No cloning required!** Use `npx` to run directly from the GitHub repository.

#### Configuration

Edit your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pdf-generator": {
      "command": "npx",
      "args": ["-y", "github:warrenandre/MCP_MD_TO_PDF"]
    }
  }
}
```

**That's it!** The first time you use it, `npx` will automatically download and set up the server. Future uses will be faster as it caches the installation.

**Benefits:**
- No local installation needed
- Always uses the latest version from GitHub
- Minimal setup
- Works on any machine with Node.js

---

### Option 2: Run Locally (For Development/Customization)

If you want to modify the server or run it locally:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/warrenandre/MCP_MD_TO_PDF.git
cd MCP_MD_TO_PDF
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Install Playwright

Playwright needs to download Chromium (first time only):

```bash
npx playwright install chromium
```

#### Step 4: Configure Claude Desktop

Edit your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "MD_TO_PDF": {
      "command": "node",
      "args": ["C:\\path\\to\\MCP_MD_TO_PDF\\index.js"]
    }
  }
}
```

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "MD_TO_PDF": {
      "command": "node",
      "args": ["/path/to/MCP_MD_TO_PDF/index.js"]
    }
  }
}
```

**Important:** Replace the path with the actual absolute path to your `index.js` file.

---

### Final Step (Both Options)

**Restart Claude Desktop** for the configuration to take effect.

**Test it:** Open Claude and try:
```
Convert sample.md to output.pdf
```

## How to Use

Once configured, simply ask Claude to convert markdown to PDF using natural language:

### Basic Conversion
```
Convert document.md to document.pdf
```

### Custom Page Format
```
Convert report.md to report.pdf using Letter format in landscape mode
```

### With Custom CSS
```
Convert notes.md to styled-notes.pdf with custom CSS:
body { font-family: Georgia, serif; font-size: 14pt; }
h1 { color: #2c3e50; }
```

### Direct Content Conversion
```
Create a PDF from this markdown content: 
# Meeting Notes
- Item 1
- Item 2

Save as meeting.pdf
```

### Get Default Styling
```
Show me the default CSS for PDF generation
```

## MCP Tools Reference

This server provides three tools that Claude can use:

### 1. `convert_markdown_to_pdf`
Convert a Markdown file to PDF.

**Parameters:**
- `markdownPath` (required): Path to input .md file
- `outputPath` (required): Path where PDF will be saved
- `customCss` (optional): Custom CSS styling
- `format` (optional): Paper format - 'A4', 'Letter', 'Legal', 'A3', 'A5', 'Tabloid' (default: 'A4')
- `landscape` (optional): Use landscape orientation (default: false)
- `printBackground` (optional): Print background graphics (default: true)

**Example request:**
```
Convert README.md to documentation.pdf
```

### 2. `convert_markdown_content_to_pdf`
Convert markdown content directly to PDF without reading from a file.

**Parameters:**
- `markdownContent` (required): Markdown text to convert
- `outputPath` (required): Path where PDF will be saved
- `customCss` (optional): Custom CSS styling
- `format` (optional): Paper format (default: 'A4')
- `landscape` (optional): Use landscape orientation (default: false)
- `printBackground` (optional): Print background graphics (default: true)

**Example request:**
```
Convert this markdown to PDF: # Hello World\n\nThis is a **test**.
Save it as output.pdf
```

### 3. `get_default_css`
Get the default CSS template used for styling.

**Use this to:**
- See the default styling
- Use as a starting point for customization
- Understand available CSS classes

**Example request:**
```
Show me the default CSS for PDF generation
```

## Default CSS Styling

The server includes GitHub-style markdown CSS by default with:
- Clean typography with system fonts
- Syntax highlighting for code blocks
- Styled tables, blockquotes, and lists
- Responsive images
- Professional headings with borders

Use `get_default_css` tool to see the complete default stylesheet.

## PDF Options

### Paper Formats
- **A4**: 210mm × 297mm (default)
- **Letter**: 8.5in × 11in
- **Legal**: 8.5in × 14in
- **A3**: 297mm × 420mm
- **A5**: 148mm × 210mm
- **Tabloid**: 11in × 17in

### Margins
Default margins: 1cm on all sides

Custom margins in `customCss`:
```css
@page {
  margin: 2cm 1.5cm;
}
```

## Troubleshooting

### Server Not Showing Up in Claude

**For GitHub Installation (Option 1):**
1. Ensure Node.js is installed (`node --version`)
2. Check the config file syntax is correct (valid JSON)
3. Restart Claude Desktop completely
4. Check Claude logs for errors (see locations below)

**For Local Installation (Option 2):**
1. Verify the path in config is correct and absolute
2. Ensure `index.js` exists at that location
3. Restart Claude Desktop completely
4. Check Claude logs for startup errors

**Claude Log Locations:**
- **Windows**: `%APPDATA%\Claude\logs\`
- **macOS**: `~/Library/Logs/Claude/`

### Playwright Not Installed

**Error**: "Executable doesn't exist at ..."

**Solution:**
```bash
npx playwright install chromium
```

This typically only affects local installations (Option 2), as GitHub installation handles dependencies automatically.

### File Not Found Errors

**Error**: "ENOENT: no such file or directory"

**Solutions:**
- Use absolute paths (e.g., `C:\Users\...\file.md`)
- Ensure the file exists and has read permissions
- Check the file extension is `.md`

### PDF Looks Different Than Expected

**Solutions:**
- Ask Claude to show the default CSS: `Show me the default CSS`
- Test with custom CSS to override defaults
- Enable `printBackground: true` for colors and backgrounds
- Try different paper formats (Letter, A4, etc.)

### Permission Denied

**Error**: "EACCES: permission denied"

**Solutions:**
- Ensure the output directory exists and is writable
- Check file permissions on the output path
- Try saving to a different location (e.g., Desktop)

## Technical Details

### Architecture

This is a **Model Context Protocol (MCP) server** that:
1. Registers tools that AI assistants can discover and use
2. Communicates via stdio (standard input/output)
3. Receives tool invocation requests in JSON format
4. Executes the requested PDF conversion
5. Returns results back to the AI assistant

### Technology Stack

- **Node.js** (ES Modules) - Runtime environment
- **@modelcontextprotocol/sdk** - MCP protocol implementation
- **Playwright** (Chromium) - Headless browser for PDF generation
- **Marked** - Markdown to HTML parser

### Conversion Process

1. **Parse**: Markdown → HTML (via Marked library)
2. **Style**: Apply CSS (default or custom)
3. **Render**: Load HTML in headless Chromium (via Playwright)
4. **Generate**: Export rendered page to PDF with specified options

### Why Playwright?

Playwright provides:
- True browser rendering (same as Chrome)
- Full CSS support including print media queries
- High-quality PDF generation
- Support for complex layouts, fonts, and graphics

Learn more about MCP: [modelcontextprotocol.io](https://modelcontextprotocol.io)

## Development

### Running Locally for Testing

If you've cloned the repository (Option 2):

```bash
node index.js
```

The server will start and communicate via stdio. You can test it with your MCP client.

### Testing with Claude

1. Create a test markdown file:
   ```bash
   echo "# Test Document\n\nThis is a **test**." > test.md
   ```

2. Ask Claude:
   ```
   Convert test.md to test.pdf
   ```

3. Check the output PDF in your working directory.

### Modifying the Server

- **Change default CSS**: Edit the `DEFAULT_CSS` constant in `index.js`
- **Add new tools**: Add to the tools array in `ListToolsRequestSchema` handler
- **Customize PDF options**: Modify the `htmlToPdf` function
- **Update dependencies**: Run `npm update`

### Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on [GitHub](https://github.com/warrenandre/MCP_MD_TO_PDF).

## License

MIT

## Links

- **GitHub Repository**: https://github.com/warrenandre/MCP_MD_TO_PDF
- **Model Context Protocol**: https://modelcontextprotocol.io
- **Playwright**: https://playwright.dev
- **Marked**: https://marked.js.org

---

**Questions or Issues?** Please open an issue on [GitHub](https://github.com/warrenandre/MCP_MD_TO_PDF/issues).

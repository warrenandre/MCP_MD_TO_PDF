# PDF MCP Server

A Model Context Protocol (MCP) server that converts Markdown to PDF using Node.js and Playwright. This server provides high-quality PDF generation with full CSS control and modern browser rendering.

## Features

- 🎨 **Beautiful Defaults**: GitHub-style markdown rendering out of the box
- 🎯 **Custom Styling**: Full control with custom CSS
- 📄 **Multiple Formats**: Support for A4, Letter, Legal, and more
- 🔄 **Flexible Input**: Convert from files or direct markdown content
- 🖨️ **Print Options**: Landscape/portrait, margins, background graphics
- ⚡ **Fast**: Powered by Playwright's Chromium engine

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers (first time only):
```bash
npx playwright install chromium
```

## Configuration

Add this server to your MCP settings file:

### Windows (Claude Desktop)
Edit: `%APPDATA%\Claude\claude_desktop_config.json`

### macOS (Claude Desktop)
Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pdf-generator": {
      "command": "node",
      "args": ["c:\\MS-POC\\SE_Projects\\MCP_servers\\PDF_Generate\\index.js"]
    }
  }
}
```

## Available Tools

### 1. `convert_markdown_to_pdf`
Convert a Markdown file to PDF.

**Parameters:**
- `markdownPath` (required): Path to input .md file
- `outputPath` (required): Path where PDF will be saved
- `customCss` (optional): Custom CSS styling
- `format` (optional): Paper format - 'A4', 'Letter', 'Legal', 'A3', 'A5', 'Tabloid' (default: 'A4')
- `landscape` (optional): Use landscape orientation (default: false)
- `printBackground` (optional): Print background graphics (default: true)

**Example:**
```
Convert README.md to PDF with default settings
```

### 2. `convert_markdown_content_to_pdf`
Convert markdown content directly to PDF without a file.

**Parameters:**
- `markdownContent` (required): Markdown text to convert
- `outputPath` (required): Path where PDF will be saved
- `customCss` (optional): Custom CSS styling
- `format` (optional): Paper format (default: 'A4')
- `landscape` (optional): Use landscape orientation (default: false)
- `printBackground` (optional): Print background graphics (default: true)

**Example:**
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

## Usage Examples

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

### Direct Content
```
Create a PDF from this content: 
# Meeting Notes
- Item 1
- Item 2

Save as meeting.pdf
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

### Playwright Not Installed
```bash
npx playwright install chromium
```

### File Not Found
- Use absolute paths or paths relative to where Claude is running
- Check file exists and has read permissions

### PDF Looks Different Than Expected
- Use `get_default_css` to see the default styling
- Test with custom CSS to override defaults
- Enable `printBackground: true` for colors and backgrounds

## Technical Details

**Stack:**
- Node.js (ES Modules)
- Playwright (Chromium)
- Marked (Markdown parser)
- MCP SDK

**Process:**
1. Parse Markdown → HTML (via Marked)
2. Apply CSS styling
3. Render in headless Chromium (via Playwright)
4. Generate PDF with specified options

## Development

### Test the Server
Create a test file:
```bash
echo "# Test Document\n\nThis is a **test**." > test.md
```

Then use Claude to convert it:
```
Convert test.md to test.pdf
```

### Debug Mode
Check server logs in Claude Desktop:
- Windows: `%APPDATA%\Claude\logs\`
- macOS: `~/Library/Logs/Claude/`

## License

MIT

## Contributing

Feel free to submit issues or pull requests for improvements!

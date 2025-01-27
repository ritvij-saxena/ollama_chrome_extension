# Ollama Chrome Extension

## Introduction

Welcome to the **Ollama Chrome Extension**! This simple extension lets you fetch a prompt from any text box and get a response via **Ollama**, which is running locally on your system. It’s a quick way to interact with **Ollama** without switching between screens.

Just write a prompt, right-click, and click **"Ask Ollama"** — and you'll get the response directly in the same field.

> This extension is a recreation and revision of a pre-existing ChatGPT Chrome extension and is made for educational purposes.

## How It Works

1. **Ollama** runs locally on your system at `http://localhost:11434`.
2. This extension communicates with **Ollama** through a server running at `http://localhost:8080` (managed by `server.js`).
3. The server sends the prompt to the locally running **Ollama** instance, and the response is inserted into the active text field or displayed as an alert if no input field is active.

### Key Features:

- **Fetch prompts** from selected text or active text fields.
- **Get responses** from locally running **Ollama**.
- **No need to switch screens**; use the right-click context menu.

## Requirements

For this to work, you need to have **Ollama** installed locally on your system.

- **Download Ollama**: You can get it from [Ollama](https://ollama.com/).
- After installation, **Ollama** runs on `http://localhost:11434`.
- Make sure `node --version >= v22.11.0` and `npm --verison >= 10.9.0`
   ```
   % node --version
   v22.11.0
   % npm --version
   10.9.0
   ```

## Installation

Follow these steps to set up the extension:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ritvij-saxena/ollama_chrome_extension.git
   ```

2. **Install dependencies**:
   After cloning, navigate to the project directory and run:

   ```bash
   npm install
   ```

3. **Start the server**:
   This will start the server which communicates with **Ollama** locally.

   ```bash
   npm start
   ```

   You should see logs like this:

   ```
   % npm start
   > ollama_chrome_extension@1.0.0 start
   > node server.js

   Using available model: mistral:latest
   Server running at http://localhost:8080
   To close there server correctly: Control (^) + C
   ```

   The script will automatically choose a local model. If no models are found, it will download the "mistral" model and use it for prompts.

## Loading the Extension in Chrome

To use the extension in Chrome, follow these steps:

1. **Open Chrome** and go to the Extensions page:  
   `chrome://extensions/`

2. **Enable Developer Mode**:
   Toggle the "Developer mode" switch in the top-right corner of the page.

3. **Load Unpacked Extension**:

   - Click the **"Load unpacked"** button.
   - Select the `ollama_chrome_extension` project directory where the extension code is located (the directory where `manifest.json` is present).

4. **Verify Extension**:
   Once loaded, there will be **no icon in the toolbar**. Instead, you can right-click on any text field or selected text on a webpage. In the context menu, you will now see an option called **"Ask Ollama"**.

5. **Use the Extension**:
   - Right-click on any text box (e.g., a text area or an input field), or highlight text on a webpage.
   - Select **"Ask Ollama"** from the context menu.
   - The response will either be inserted into the field or shown as an alert if no text field is active.

## Troubleshooting

- **Ollama server is not running**: Make sure the **Ollama** server is running at `http://localhost:11434` before using the extension.
- **Error with port or request failed**: If you get an error, it might be due to an issue with the server setup. Ensure the server is running and the correct ports are open.

  
## Screen Recording 
- If the local server `http://localhost:8080` (managed by `server.js`) is up and running successfully!

https://github.com/user-attachments/assets/cab4fd37-9f96-444f-800c-e2eaa9749800

- If the local server `http://localhost:8080` (managed by `server.js`) is **NOT** up and running successfully *X*

https://github.com/user-attachments/assets/5a7feac9-c9e6-46da-88d5-cd7f8c9fcf66




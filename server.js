import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 8080;

let modelToUse = ""; // Global variable to store the model being used

app.use(cors());
app.use(bodyParser.json());

// Check available models from Ollama API
const checkAvailableModels = async () => {
  try {
    const response = await fetch("http://localhost:11434/api/tags"); // Endpoint to get available models
    if (!response.ok) {
      throw new Error("Failed to fetch models from Ollama");
    }

    const data = await response.json();
    const models = data.models;

    if (models && models.length > 0) {
      modelToUse = models[0].name; // Picking the first available model
      console.log(`Using available model: ${modelToUse}`);
      return true;
    } else {
      console.log("No models available, will download a smaller one.");
      return false;
    }
  } catch (err) {
    console.error("Error checking available models:", err);
    return false;
  }
};

// Download a model if not found
const downloadModel = async () => {
  try {
    console.log("Downloading the smallest model...");

    const response = await fetch("http://localhost:11434/api/pull", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to download model");
    }

    const tag_response = await fetch("http://localhost:11434/api/tags");
    if (tag_response.ok) {
      // Parse the response body as JSON
      const responseBody = await tag_response.json();
      modelToUse = responseBody.models[0].name;
    } else {
      console.log("Error fetching tags:", response.statusText);
    }
    console.log(`Model ${modelToUse} downloaded and ready to use.`);
  } catch (err) {
    console.error("Error downloading model:", err);
  }
};

// Function to initialize and check models, then start the server
const initializeModelAndStartServer = async () => {
  const modelsAvailable = await checkAvailableModels();

  if (!modelsAvailable) {
    await downloadModel(); // Download the model if no models are available
  }

  // Start the server after ensuring a model is ready
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`To close there server correctly: Control (^) + C`);
  });
};

app.post("/ask", async (req, res) => {
  try {
    if (!modelToUse) {
      return res.status(500).json({ error: "No model available" });
    }

    const message = req.body.message;
    // console.log(`User's prompt: ${message}`); // debug purposes only

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelToUse,
        prompt: message,
        stream: false, // Ensuring a single response instead of NDJSON
      }),
    });

    if (!ollamaResponse.ok) {
      return res
        .status(ollamaResponse.status)
        .json({ error: "Error with Ollama API" });
    }

    // Parse the single JSON response
    const ollamaData = await ollamaResponse.json();

    // Extract the response text, ensuring proper spacing and formatting
    const responseText = (ollamaData.response || ollamaData.text || "")
      .replace(/\s+/g, " ") // Remove excessive spaces
      .replace(/\s([.,!?;:])/g, "$1") // Fix punctuation spacing
      .trim();

    // console.log(`responseText: ${responseText}`); // debug purposes only

    res.json({ reply: responseText });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/debug", (req, res) => {
  try {
    res.json({
      message: "Your Server is running",
      request: {
        param: req.params,
        body: req.body,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Initialize model and start the server
initializeModelAndStartServer();

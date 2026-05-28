import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy client setup to fail smoothly if API key is not yet set
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add your key in the Secrets panel under Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Increase payload bounds for high-res screenshots and photos
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Check API Route Status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API service is active. Gemini backend is ready." });
});

// Endpoint: Turn Design Image into Live Code
app.post("/api/convert", async (req, res) => {
  try {
    const { image, options } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No design screenshot or image was uploaded." });
    }

    const format = options?.framework || "html-tailwind";
    const style = options?.style || "modern";
    const customInstructions = options?.customInstructions || "";
    const targetLanguage = options?.targetLanguage || "English";
    const threeJsEnabled = !!options?.threeJsEnabled;
    const devOpts = options?.developerOptions || {};
    
    const temperature = typeof devOpts.temperature === 'number' ? devOpts.temperature : 0.7;
    const cssVarSetup = devOpts.cssVarSetup || 'tailwind';
    const engineMode = devOpts.engineMode || 'interactive';
    const customHeaders = devOpts.customHeaders || '';

    // Parse base64
    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    let mimeType = "image/png";
    let base64Data = image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }

    const ai = getAi();

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      }
    };

    const systemPrompt = `You are codecraft-design, an elite senior frontend architect, 3D visualization specialist, and localization expert. Your job is to translate drawings, wireframes, or mockup screenshots into state-of-the-art interactive coding assets.

You MUST fully support:
- Framework Selection: Produce 'frameworkCode' dynamically using exact syntax specifications for the chosen format:
  - 'html-tailwind': Clean HTML5 + CDN script modules.
  - 'react-tailwind': Standalone React component using hooks (useState/useEffect) and named Lucide React icon imports.
  - 'vanilla': Raw HTML5 and beautiful custom CSS classes.
  - 'vue-tailwind': Vue 3 Single File Component style (<script setup lang="ts">) with layouts and templates.
  - 'svelte-tailwind': Clean .svelte file with integrated states and reactivity.
  - 'nextjs-tailwind': Stands as a modern Next.js App Router Page ("use client") matching hooks.
- Language/Translation Localization Target:
  - If the target language is configured to anything other than English, you MUST translate and render ALL user interface copy, headlines, navigation tabs, buttons, forms, metric alerts and placeholders entirely in ${targetLanguage}.
- 3D Interactive Three.js System:
  - If ThreeJS mode is enabled (${threeJsEnabled}), you MUST inject '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>' inside the 'htmlCode'. Additionally, include inline JavaScript that mounts a beautiful, reactive, and high-performance Three.js WebGL canvas scene (such as interactive particles, rotating glowing wireframes, custom grid shaders, or cosmos galaxies) that responds beautifully to user mouse-move client inputs.
- Custom CSS Blueprint setups:
  - 'tailwind' -> Styling with Tailwind browser-based script.
  - 'bootstrap' -> Load '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">' and styling with Bootstrap columns and alert variables.
  - 'custom-css' -> Inline bespoke styling with custom class attributes.
- Optimizing Engine Modes:
  - 'interactive' -> Deliver maximum micro-interactions, responsive hover states, mock forms calculators, accordion animations.
  - 'commented' -> Add comprehensive coder inline documentation and layout flow diagrams in comments.
  - 'lean' -> Return optimized, minified markup and lightweight layouts, discarding verbose descriptors.

Format specification guidelines:
- Ensure raw code blocks are returned inside pure string structures without escaping issues.
- Never wrap the returned json property values inside additional markdown blocks.

Your response MUST be strict JSON matching this structure:
{
  "htmlCode": "Complete standalone index.html page code starting with <!DOCTYPE html>. If Three.js is enabled, include script and a beautiful 3D particle setup.",
  "frameworkCode": "The equivalent modular framework template for ${format}.",
  "explanation": "A concise architectural and behavioral guide of how to run the scene, written in ${targetLanguage}."
}`;

    const promptText = `Rebuild this screenshot wireframe or mockup layout with the following specifications:
- Framework: ${format}
- Aesthetic Accent: ${style}
- Output Human Translation Language: ${targetLanguage}
- Enable Interactive Three.js visuals: ${threeJsEnabled ? "YES - Render a gorgeous interactive 3D particle constellation or grid" : "NO"}
- CSS Framework Blueprint: ${cssVarSetup}
- Builder Engine Mode: ${engineMode}
- Dynamic developer headers: ${customHeaders || "None"}
- Additional specific design details: ${customInstructions || "Match layout structure exactly."}

Review the aesthetics in the image closely. Recreate its grids, sidebars, charts, inputs, cards, and styling. Implement full mouse tracking or animated reactions for buttons or canvases inside the HTML build.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          parts: [
            imagePart,
            { text: promptText }
          ]
        }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: temperature,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            htmlCode: { type: Type.STRING, description: "Complete interactive index.html code conforming to the requested styles." },
            frameworkCode: { type: Type.STRING, description: "Modular code suited for developer framework consumption." },
            explanation: { type: Type.STRING, description: "Behavioral/layout explanation." }
          },
          required: ["htmlCode", "frameworkCode", "explanation"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Zero response characters returned from the generation models.");
    }

    const payload = JSON.parse(response.text.trim());
    return res.json(payload);

  } catch (err: any) {
    console.error("Conversion pipeline error:", err);
    return res.status(500).json({ error: err.message || "Could not successfully compile the design image." });
  }
});

// Endpoint: Iterate and Refine Live Code via Text Commands
app.post("/api/refine", async (req, res) => {
  try {
    const { history, previousCode, previousFrameworkCode, instruction, options, image } = req.body;
    if (!instruction) {
      return res.status(400).json({ error: "Refinement message was empty." });
    }

    const format = options?.framework || "html-tailwind";
    const targetLanguage = options?.targetLanguage || "English";
    const threeJsEnabled = !!options?.threeJsEnabled;
    const devOpts = options?.developerOptions || {};
    const temperature = typeof devOpts.temperature === 'number' ? devOpts.temperature : 0.7;

    const ai = getAi();
    
    // Process dialogue flow
    const historyTranscript = history && history.length > 0
      ? history.map((msg: any) => `${msg.role === 'user' ? 'Client' : 'Designer'}: ${msg.content}`).join("\n")
      : "";

    const systemPrompt = `You are codecraft-design, an elite senior frontend architect, 3D visualization specialist, and localization expert. Refine the provided webpage code based on new client feedback and instructions.

Ensure the original structure is preserved while carefully embedding the new changes. Maintain and enhance:
- Framework style parameters: Format framework output corresponding to ${format}.
- Localization & translation: Maintain human-language localization in **${targetLanguage}** if it is requested or set.
- 3D Visualizations: If Three.js is active (${threeJsEnabled}), ensure the '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>' tag is preserved, and the WebGL scene is polished, updated or expanded as per client instructions.
- Aesthetic details, responsive metrics, custom forms, mock state controls, and Lucide Icons.

The response MUST match this strict JSON schema:
{
  "htmlCode": "Fully revised standalone raw index.html code including the requested update.",
  "frameworkCode": "Fully revised modular code in the framework style: ${format}.",
  "explanation": "Summary of modifications applied to the previous build, written in ${targetLanguage}."
}

Do not use Markdown formatting inside the JSON code properties.`;

    const contents: any[] = [];

    // Optional visual coordinate guidance
    if (image) {
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      let mimeType = "image/png";
      let base64Data = image;
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
      contents.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }

    const promptText = `Modify the current codebase based on the refinement instruction.

--- PREVIOUS HTML CODE ---
${previousCode}

--- PREVIOUS FRAMEWORK CODE ---
${previousFrameworkCode}

--- REFINEMENT HISTORY ---
${historyTranscript}

--- NEW CLIENT REQUEST ---
👉 ${instruction}

Please implement this exact request inside BOTH the standalone index.html ('htmlCode') and the targeted framework component file ('frameworkCode'). Ensure that all interactive logic, styling scripts, and Lucide elements are updated and functioning correctly. Maintain output translation in **${targetLanguage}** if specified. Provide a short explanation of additions in ${targetLanguage}.`;

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: contents },
      config: {
        systemInstruction: systemPrompt,
        temperature: temperature,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            htmlCode: { type: Type.STRING, description: "Pruned and revised index.html." },
            frameworkCode: { type: Type.STRING, description: "Updated developer framework code." },
            explanation: { type: Type.STRING, description: "List of updates made." }
          },
          required: ["htmlCode", "frameworkCode", "explanation"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Zero output received during model refinement query.");
    }

    const payload = JSON.parse(response.text.trim());
    return res.json(payload);

  } catch (err: any) {
    console.error("Refinement pipeline error:", err);
    return res.status(500).json({ error: err.message || "Failed to update custom code layout." });
  }
});

// Boot and proxy mapping
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Server online at http://localhost:${PORT}`);
  });
}

startServer();

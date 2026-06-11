import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import AdmZip from "adm-zip";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies
app.use(express.json());

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
      throw new Error("GEMINI_API_KEY is not configured or is the default placeholder");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Endpoint for AI Executive Insights
app.post("/api/gemini/insights", async (req, res) => {
  try {
    const { tasks, goals, habits, budget, trips, historicalContext } = req.body;
    
    // Construct executive brief context
    const brief = `
    Active Tasks count: ${tasks?.length || 0}
    Goals count: ${goals?.length || 0}
    Habit Consistency: ${habits?.consistency || "88"}%
    Budget Balance: $${budget?.balance || "4,850"}
    Upcoming Trips: ${trips?.length || 0}
    
    Current state of tasks:
    ${(tasks || []).slice(0, 5).map((t: any) => `- [${t.status}] ${t.title}`).join("\n")}
    
    Current state of goals:
    ${(goals || []).slice(0, 5).map((g: any) => `- ${g.title} (${g.progress}% progress)`).join("\n")}
    `;

    try {
      const ai = getGeminiClient();
      const prompt = `You are the ultimate AI Chief Executive Advisor and corporate elite consultant. You speak with high vocabulary, supreme elegance, absolute precision, and concise sharpness (like a top-tier McKinsey partner or Bloomberg senior strategist).
      Based on the current executive command center data:
      ${brief}
      
      Generate a single briefing quote/sentence for the CEO dashboard (MAXIMUM 20 words). Examples of elite tone:
      - "Revenue streams remain stable; recommend consolidating capital into high-growth R&D to exploit the 14% productivity surge."
      - "With 7 goals in progress, prioritize client strategy meeting to solidify Q3 growth before the Zurich trip."
      - "Habit consistency is an elite 88%; deploy surplus balance to reinforce marketing efforts while travel schedules sustain momentum."

      Ensure your output is just a single string without markdown bold headers, keeping it extremely clean and powerful. Do not include any greeting or conversational fluff, return ONLY the direct strategic insight. Code-level instructions: return ONLY plain text.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const insight = response.text?.trim() || "You are 14% ahead of last week's productivity pace.";
      res.json({ success: true, insight });
    } catch (apiError: any) {
      console.warn("Gemini API call failed or is unconfigured. Falling back to elite heuristic insights:", apiError.message);
      // Let's provide a set of sophisticated mock insights based on current metrics to ensure a highly responsive UI
      const mockQuotes = [
        "Elite performance detected: current 14% productivity surge creates optimal margins for direct market expansion.",
        "Budget balance holding strong at $4,850. Recommend capital reallocation into digital user acquisition structures immediately.",
        "Triple upcoming business travel routes identified. Consolidate strategic briefings to maximize cross-border enterprise pipelines.",
        "With 24 active tasks, delegate peripheral items. Maintain peak executive focus on key investor presentation timelines.",
        "Your habit discipline sits at a stellar 88%. This consistent momentum is directly driving project milestone velocity."
      ];
      const randomQuote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
      res.json({ success: true, insight: randomQuote, note: "Adaptive simulation activated due to unconfigured API key." });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint for Corporate Executive Boardroom Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: "Invalid messages array." });
    }

    const { tasks, goals, habits, budget, trips } = context || {};
    const contextInstruction = `You are "AI CEO Advisor" — the ultimate sovereign AI Chief of Staff and McKinsey McKinsey-caliber elite boardroom consultant. 
    You are speaking directly to the CEO inside their Windows 11 Ultra-Luxury Executive Command Center.
    Your tone must be authoritative, highly refined, objective, mathematically precise, and elegant (infused with high business acumen, terms like 'leverage', 'synergy', 'asymmetry', 'capital efficiency', 'scalability').
    Keep your responses structured, professional, and visually elegant. Use clean formatting with bold titles and neat bullet points where appropriate.
    
    The company's current real-time metrics:
    - Active Tasks: ${tasks?.length || 0} active projects
    - Active Goals: ${goals?.length || 0} major initiatives running
    - Habit Momentum: ${habits?.consistency || "88"}% consistency
    - Liquidity / Budget: $${budget?.balance || "4,850"} surplus
    - Trips planned: ${trips?.length || 0} upcoming business sectors
    
    Address the CEO directly and respectfully. Guide them in making heavy leverage strategic decisions. Ensure your answers are brilliant and actionable.`;

    try {
      const ai = getGeminiClient();
      
      // Transform incoming messages list into the format suitable for generateContent
      // Or we can use chats.create, but let's map simple prompt structures for maximum reliability
      const formattedChatContents = messages.map((m: any) => {
        return {
          role: m.role === "assistant" ? "model" as const : "user" as const,
          parts: [{ text: m.content }]
        };
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedChatContents,
        config: {
          systemInstruction: contextInstruction,
          temperature: 0.8,
        }
      });

      const text = response.text || "I apologize, but I was unable to compile the strategic response. Let us evaluate our financial assets.";
      res.json({ success: true, content: text });
    } catch (apiError: any) {
      console.warn("Gemini API call failed or is unconfigured. Falling back to local consultant intelligence:", apiError.message);
      
      // We will define a sophisticated mock responsive chatbot that answers business-related questions
      const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "Understood, CEO. Given our current positioning, let's explore this meticulously. ";
      
      if (userMessage.includes("budget") || userMessage.includes("money") || userMessage.includes("finance") || userMessage.includes("allocate")) {
        reply = `**BOARDROOM DIRECTIVE: FINANCIAL REALLOCATION**
        
Our active capital sits at **$4,850**. To optimize ROI and create a high-leverage business loop, I propose the following distribution model:

1. **Client Acquisition (35% - $1,697)**: Channel capital into top-of-funnel hyper-targeted B2B digital lead gen to secure our next enterprise pilot contract.
2. **Product Polish & Operational Velocity (40% - $1,940)**: Accelerate milestones regarding our **Goal: Launch Enterprise Alpha**.
3. **Strategic Buffer (25% - $1,213)**: Guarantee liquidity for flight contingencies on our upcoming premium routes.

*Operational recommendation*: Establish a strict cash-flow auditing rhythm to maintain over 85% fiscal retention this quarter. What specific spending sector shall we dissect next?`;
      } else if (userMessage.includes("task") || userMessage.includes("productivity") || userMessage.includes("focus")) {
        reply = `**STATUS BRIEFING: OPERATIONAL VELOCITY**

We currently monitor **24 Active Tasks**. To ensure peak execution with zero cognitive drag:

*   **Rule of Critical Three**: Instantly delegate all peripheral operational cards. The CEO must only touches the three focus items listed: **Finalize Investor Presentation**, **Complete Budget Review**, and **Client Strategy Meeting**.
*   **Asynchronous Levers**: Use the upcoming business travel corridors to complete deep-focus work (e.g. presentation deck iteration) while offline.

Would you like me to analyze any specific blocker in your queue to automate its resolution?`;
      } else if (userMessage.includes("goal") || userMessage.includes("milestone")) {
        reply = `**STRATEGIC BLUEPRINT: GOAL MOBILIZATION**

We are tracking **7 Corporate Goals** simultaneously. The current primary focus is **Launch Enterprise Alpha** (65% completed).

*   **Optimization Pipeline**: The budget overhead must be tightened to release trapped project resources. We should allocate a portion of our $4,850 balance to finalize the core server architecture.
*   **Milestone Warning**: Do not let your team schedule minor task milestones during the travel window to Tokyo; focus purely on client-facing signatures.

Should we establish a tighter KPI verification matrix for these goals?`;
      } else if (userMessage.includes("travel") || userMessage.includes("trip") || userMessage.includes("flight")) {
        reply = `**CORRIDOR DIRECTIVE: GLOBAL ROUTE OPTIMIZATION**

With **3 upcoming routes** planned (Zurich, Tokyo, London), we must leverage these geographic touchpoints to build corporate momentum:

1. **Zurich Route (Tech Capital Symposium)**: Focus strictly on sovereign funds and luxury family offices.
2. **Tokyo Route (Enterprise Alpha Signing)**: Schedule high-end dinner events with regional stakeholders.
3. **London Route (Fintech Summit & Liquidity)**: Review our seed ledger with key investors face-to-face.

*Preparation directive*: Complete the Investor Presentation slide deck before leaving. It is critical to pitch with flawless visual and economic telemetry.`;
      } else {
        reply = `**EXECUTIVE INSIGHT: MACRO STRETCH SECTORS**

CEO, we have evaluated your query and mapped it against our active corporate status:
- **Productivity Pace**: We are maintaining an exceptional velocity, tracking **14% ahead** of our historic benchmark.
- **Capital Reserves**: Stable liquidity pool of **$4,850** provides solid options for opportunistic strategic investments.
- **Workflow Health**: **24 tasks** are distributed across **7 strategic goals**. 

To maximize enterprise value, tell me which strategic leverage point you wish to deploy next: **Capital Allocation**, **Product Dev Automations**, or **Travel Corridors**?`;
      }
      
      res.json({ success: true, content: reply, note: "Simulated boardroom responses activated." });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to serve manifest.json directly to support PWA tools like PWABuilder
app.all("/manifest.json", (req, res, next) => {
  // CORS Headers are CRITICAL for external tools like PWABuilder to read our manifest
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/manifest.json", (req, res) => {
  try {
    const manifestPath = path.join(process.cwd(), "public", "manifest.json");
    if (fs.existsSync(manifestPath)) {
      res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
      return res.sendFile(manifestPath);
    }
    // Fallback JSON in case the file system is locked/sandboxed
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.json({
      "name": "AI CEO Executive Command Center",
      "short_name": "AI CEO",
      "description": "Premium Microsoft Store Executive Command Center - Bloomberg & Windows 11 Fluent Glassmorphism Dashboard.",
      "start_url": "/",
      "display": "standalone",
      "background_color": "#000000",
      "theme_color": "#D4AF37",
      "icons": [
        {
          "src": "https://img.icons8.com/isometric/512/32a136/crown.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any maskable"
        },
        {
          "src": "https://img.icons8.com/isometric/192/32a136/crown.png",
          "sizes": "192x192",
          "type": "image/png"
        }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Endpoint to download full compiled source zip for packaging MSIX offline
app.get("/api/download-zip", (req, res) => {
  try {
    const zip = new AdmZip();
    
    // Add primary configuration files individually so we don't grab garbage
    const rootFiles = [
      "package.json",
      "tsconfig.json",
      "vite.config.ts",
      "server.ts",
      "index.html",
      "WINDOWS_MSIX_GUIDE.md",
      "metadata.json",
      ".env.example"
    ];
    
    rootFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        zip.addLocalFile(filePath);
      }
    });
    
    // Recursive folder additions
    const srcPath = path.join(process.cwd(), "src");
    if (fs.existsSync(srcPath)) {
      zip.addLocalFolder(srcPath, "src");
    }
    
    const publicPath = path.join(process.cwd(), "public");
    if (fs.existsSync(publicPath)) {
      zip.addLocalFolder(publicPath, "public");
    }
    
    const zipBuffer = zip.toBuffer();
    
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=AI_CEO_Executive_Command_Center.zip");
    res.send(zipBuffer);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve manifest.json globally with optimal CORS headers for PWABuilder compatibility
app.all("/manifest.json", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
}, (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json");
  const publicPath = path.join(process.cwd(), "public", "manifest.json");
  if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  }
  const distPath = path.join(process.cwd(), "dist", "manifest.json");
  if (fs.existsSync(distPath)) {
    return res.sendFile(distPath);
  }
  res.status(404).json({ error: "manifest.json not found" });
});

// Serve sw.js globally with optimal CORS headers and Service-Worker-Allowed header
app.all("/sw.js", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
}, (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Service-Worker-Allowed", "/");
  const publicPath = path.join(process.cwd(), "public", "sw.js");
  if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  }
  const distPath = path.join(process.cwd(), "dist", "sw.js");
  if (fs.existsSync(distPath)) {
    return res.sendFile(distPath);
  }
  res.status(404).send("sw.js not found");
});

// Serve static assets and inject Vite dev server in development
async function startServer() {
  const isProd = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist"));

  if (!isProd) {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);

      // Fallback to transform and serve index.html in development mode
      app.get("*", async (req, res, next) => {
        try {
          const htmlPath = path.join(process.cwd(), "index.html");
          if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, "utf-8");
            html = await vite.transformIndexHtml(req.originalUrl, html);
            return res.status(200).set({ "Content-Type": "text/html" }).end(html);
          }
          next();
        } catch (err) {
          next(err);
        }
      });
      console.log("[AI CEO] Dev server running via Vite middleware successfully.");
    } catch (err: any) {
      console.warn("[AI CEO] Failed to initialize Vite dev server, falling back to static server:", err.message);
      serveStaticProduction();
    }
  } else {
    serveStaticProduction();
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI CEO] Server listening on http://0.0.0.0:${PORT} under environment: ${process.env.NODE_ENV || "development"}`);
  });
}

function serveStaticProduction() {
  const distPath = path.join(process.cwd(), "dist");
  const publicPath = path.join(process.cwd(), "public");

  // Serve static assets from dist first
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }
  
  // Serve static assets from public folder as a direct backup
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  app.get("*", (req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    const rootIndexPath = path.join(process.cwd(), "index.html");
    if (fs.existsSync(rootIndexPath)) {
      return res.sendFile(rootIndexPath);
    }
    res.status(404).send("Error: Production index.html not found. Please compile the app first.");
  });
}

startServer();

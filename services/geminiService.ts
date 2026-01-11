
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async chatWithAI(message: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[] = []) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are WebMaster AI Assistant, an expert web developer, SEO specialist, and digital strategist. Help the user manage their website, domains, hosting, and content.",
      },
    });
    return response.text;
  },

  async searchGrounding(query: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || '#'
    })) || [];

    return { text, sources };
  },

  async generateBlockLayout(prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a suggested page layout for: "${prompt}". 
      Return a JSON array of blocks. Each block must have:
      - type: "hero", "text", "features", "cta", or "gallery"
      - content: an object with appropriate fields (title, body, buttonText, items)
      Return 4-6 blocks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              content: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  body: { type: Type.STRING },
                  buttonText: { type: Type.STRING },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            required: ["type", "content"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async suggestDomains(keyword: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 5 catchy and available-sounding domain names related to "${keyword}". 
      Return them as a JSON array of strings. Include various extensions like .com, .io, .ai, .tech.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async generateBlogPost(topic: string, tone: string = 'professional') {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a high-quality blog post about "${topic}" in a ${tone} tone. 
      The response should be in JSON format with "title" and "content" (markdown) fields.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateSiteCopy(section: string, prompt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate professional website copy for the "${section}" section. 
      Context/Brand: ${prompt}.
      Return JSON with "headline" and "body" fields.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["headline", "body"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async suggestKeywords(topic: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform in-depth keyword research for "${topic}". Suggest 10 high-value keywords. 
      For each keyword provide:
      - keyword: phrase
      - volume: monthly volume (e.g. "2.4K")
      - difficulty: Number (0-100)
      - value: Number (0-100, representing business value/ROI)
      - intent: Informational, Transactional, Navigational, or Commercial
      - strategy: A brief 1-sentence content strategy.
      - cluster: A category name to group this keyword into (e.g. "Technical", "Beginner", "Comparison").
      Return as JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              volume: { type: Type.STRING },
              difficulty: { type: Type.NUMBER },
              value: { type: Type.NUMBER },
              intent: { type: Type.STRING },
              strategy: { type: Type.STRING },
              cluster: { type: Type.STRING }
            },
            required: ["keyword", "volume", "difficulty", "value", "intent", "strategy", "cluster"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async generateContentBrief(keyword: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a detailed content strategy brief for the target keyword: "${keyword}".
      Include the following in JSON format:
      - audience: Who is the ideal reader?
      - proposedHeadline: A catchy SEO-optimized title.
      - talkingPoints: Array of 5 key points to cover.
      - internalLinking: Array of 3 pages or topics to link to.
      - semanticKeywords: Array of 5 LSI/semantic keywords to include for better SEO.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyword: { type: Type.STRING },
            audience: { type: Type.STRING },
            proposedHeadline: { type: Type.STRING },
            talkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            internalLinking: { type: Type.ARRAY, items: { type: Type.STRING } },
            semanticKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["keyword", "audience", "proposedHeadline", "talkingPoints", "internalLinking", "semanticKeywords"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateSitemapMetadata(paths: string[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `For these website paths: ${paths.join(', ')}, suggest SEO metadata.
      Return a JSON array of objects, each containing:
      - path: string (the original path)
      - priority: number (0.0 to 1.0)
      - lastModified: string (YYYY-MM-DD)
      - metaDescription: string (brief description)
      - titleTag: string (suggested SEO title tag)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              path: { type: Type.STRING },
              priority: { type: Type.NUMBER },
              lastModified: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              titleTag: { type: Type.STRING }
            },
            required: ["path", "priority", "lastModified", "titleTag"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async crawlSiteStructure(rootUrl: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I have a website starting at "${rootUrl}". Predict the 10 most likely sub-pages/paths for this site based on its URL and common web patterns. 
      Return a JSON array of objects, each containing:
      - path: string (the URL path starting with /)
      - priority: number (0.0 to 1.0)
      - lastModified: string (current date YYYY-MM-DD)`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              path: { type: Type.STRING },
              priority: { type: Type.NUMBER },
              lastModified: { type: Type.STRING }
            },
            required: ["path", "priority", "lastModified"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },

  async generateSchemaMarkup(type: string, details: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a valid JSON-LD schema markup of type "${type}" based on these details: "${details}". 
      Ensure it follows schema.org standards. Return ONLY the JSON object, not wrapped in markdown or script tags.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return response.text;
  },

  async fetchSearchConsoleData(domain: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 30 days of simulated Google Search Console performance data for the domain "${domain}". 
      Return a JSON object with:
      - metrics: array of objects { date: "YYYY-MM-DD", clicks: number, impressions: number, ctr: number, position: number }
      - topQueries: array of objects { query: string, clicks: number, impressions: number, ctr: string, position: number }
      - summary: object { totalClicks: number, totalImpressions: number, avgCtr: number, avgPosition: number }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  clicks: { type: Type.NUMBER },
                  impressions: { type: Type.NUMBER },
                  ctr: { type: Type.NUMBER },
                  position: { type: Type.NUMBER }
                },
                required: ["date", "clicks", "impressions", "ctr", "position"]
              }
            },
            topQueries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  query: { type: Type.STRING },
                  clicks: { type: Type.NUMBER },
                  impressions: { type: Type.NUMBER },
                  ctr: { type: Type.STRING },
                  position: { type: Type.NUMBER }
                },
                required: ["query", "clicks", "impressions", "ctr", "position"]
              }
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                totalClicks: { type: Type.NUMBER },
                totalImpressions: { type: Type.NUMBER },
                avgCtr: { type: Type.NUMBER },
                avgPosition: { type: Type.NUMBER }
              },
              required: ["totalClicks", "totalImpressions", "avgCtr", "avgPosition"]
            }
          },
          required: ["metrics", "topQueries", "summary"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }
};

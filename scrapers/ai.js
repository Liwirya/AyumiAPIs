import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "YOUR_GEMINI_APIKEY",
});

const groundingTool = {
  googleSearch: {},
  codeExecution: {}, 
};

const configSearch = {
  tools: [groundingTool],
};

const googleSearch = async (query) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [query],
      config: configSearch,
    });
    return response.text;
  } catch (error) {
    console.error("Google Search Error:", error);
    return null;
  }
};

const googleExecuteCode = async (query) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [query],
      config: {
        tools: [{ codeExecution: {} }],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    let output = "";
    parts.forEach((part) => {
      if (part.text) output += part.text + "\n";
      if (part.executableCode && part.executableCode.code) {
        output += "Code:\n" + part.executableCode.code + "\n";
      }
      if (part.codeExecutionResult && part.codeExecutionResult.output) {
        output += "Result:\n" + part.codeExecutionResult.output + "\n";
      }
    });

    return output;
  } catch (error) {
    console.error("Google Execute Code Error:", error);
    return null;
  }
};

const googleMapsGenerate = async (query, latLng) => {
  try {
    const config = {
      tools: [{ googleMaps: { enableWidget: true } }],
      toolConfig: {
        retrievalConfig: {
          latLng: latLng || null, 
        },
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [query],
      config,
    });

    const groundingMetadata = response.candidates[0]?.groundingMetadata;

    return {
      text: response.text,
      groundingMetadata,
    };
  } catch (error) {
    console.error("Google Maps Generate Error:", error);
    return null;
  }
};

export { googleSearch, googleExecuteCode, googleMapsGenerate };

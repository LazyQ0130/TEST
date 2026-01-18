
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, AssessmentResult } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAssessmentAnalysis = async (
  result: AssessmentResult
): Promise<AIAnalysis | null> => {
  const ai = createClient();
  if (!ai) return null;

  let promptContext = "";
  
  switch (result.type) {
    case 'MBTI':
      promptContext = `Assessment: MBTI. Result: ${result.data.type}. Percentages: ${JSON.stringify(result.data.percentages)}`;
      break;
    case 'HOLLAND':
      promptContext = `Assessment: Holland Code (Career). Result Code: ${result.data.code}. Scores: ${JSON.stringify(result.data.scores)}`;
      break;
    case 'SCL90':
      promptContext = `Assessment: SCL-90 (Psychological Health). Severity: ${result.data.severity}. Factors: ${JSON.stringify(result.data.factorScores)}`;
      break;
    case 'IQ':
      promptContext = `Assessment: IQ Test. Level: ${result.data.level}.`;
      break;
    case 'EQ':
      promptContext = `Assessment: EQ Test. Level: ${result.data.level}.`;
      break;
    case 'SPIRITUAL':
      promptContext = `Assessment: Spiritual Needs. Dominant Need: ${result.data.dominant}. Scores: ${JSON.stringify(result.data.scores)}`;
      break;
  }

  const prompt = `
    ${promptContext}
    
    Provide a professional, psychological analysis in Chinese (Simplified).
    Return JSON.
    Structure:
    - title: Creative title for this result.
    - summary: 2 sentence summary.
    - keyTraits: 4 bullet points of traits.
    - recommendations: 4 actionable advice items.
    - detailedAnalysis: A paragraph (approx 100 words) of deep insight.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedAnalysis: { type: Type.STRING },
          },
          required: ["title", "summary", "keyTraits", "recommendations", "detailedAnalysis"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysis;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title: "分析服务暂不可用",
      summary: "无法连接到AI服务器。",
      keyTraits: ["N/A"],
      recommendations: ["请检查网络连接"],
      detailedAnalysis: "由于网络或API限制，暂时无法生成详细报告。"
    };
  }
};

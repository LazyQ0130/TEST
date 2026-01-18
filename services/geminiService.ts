import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Please set process.env.API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMBTIAnalysis = async (
  mbtiType: string,
  percentages: { EI: number; SN: number; TF: number; JP: number }
): Promise<AIAnalysis | null> => {
  const ai = createClient();
  if (!ai) return null;

  const prompt = `
    User MBTI Result: ${mbtiType}
    Detailed Breakdown:
    - Extraversion (E): ${percentages.EI}% vs Introversion (I): ${100 - percentages.EI}%
    - Sensing (S): ${percentages.SN}% vs Intuition (N): ${100 - percentages.SN}%
    - Thinking (T): ${percentages.TF}% vs Feeling (F): ${100 - percentages.TF}%
    - Judging (J): ${percentages.JP}% vs Perceiving (P): ${100 - percentages.JP}%

    Provide a detailed, professional, yet engaging psychological analysis for this specific user.
    The output must be in JSON format.
    Language: Chinese (Simplified).
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
            title: { type: Type.STRING, description: "A creative title for this personality type (e.g., 'The Strategic Mastermind')" },
            shortDescription: { type: Type.STRING, description: "A 2-sentence summary of the personality." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 4 key strengths." },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 4 key weaknesses." },
            careerPaths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 4 suitable career roles." },
            relationships: { type: Type.STRING, description: "Advice on romantic or social relationships." },
            famousPeople: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3 famous people with this type." },
          },
          required: ["title", "shortDescription", "strengths", "weaknesses", "careerPaths", "relationships", "famousPeople"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysis;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback mock data in case of error (or no API key in dev)
    return {
      title: `${mbtiType} - 分析生成失败`,
      shortDescription: "我们暂时无法连接到AI分析服务，但根据您的选项，您属于上述类型。",
      strengths: ["数据不足", "请检查网络", "或API配置", "稍后重试"],
      weaknesses: ["暂时无法分析", "暂时无法分析", "暂时无法分析", "暂时无法分析"],
      careerPaths: ["通用职业建议"],
      relationships: "请稍后重试以获取关系建议。",
      famousPeople: ["N/A"]
    };
  }
};
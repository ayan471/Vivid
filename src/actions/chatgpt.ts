"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateCreativePrompt = async (userPrompt: string) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const finalPrompt = `
  Create a coherent and relevant outline for the following prompt: ${userPrompt}.
  The outline should consist of at least 6 points, with each point written as a single sentence.
  Ensure the outline is well-structured and directly related to the topic.
  Return the output in the following JSON format:
  
  {
    "outlines": [
      "Point 1",
      "Point 2",
      "Point 3",
      "Point 4",
      "Point 5",
      "Point 6"
    ]
  }
  
  Ensure that the JSON is valid and properly formatted. Do not include any other text or explanations outside the JSON.
  `;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful AI that generates outlines for presentations.",
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: finalPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.0,
      },
    });

    const response = await result.response;
    const responseContent = response.text();

    if (responseContent) {
      try {
        // Remove any potential markdown formatting
        const cleanedContent = responseContent
          .replace(/```json\n|\n```/g, "")
          .trim();
        const jsonResponse = JSON.parse(cleanedContent);
        return { status: 200, data: jsonResponse };
      } catch (error) {
        console.error("Invalid JSON received", responseContent, error);
        return { status: 500, error: "Invalid JSON format received from AI" };
      }
    }
    return { status: 400, error: "No content generated" };
  } catch (error) {
    console.error("🔴 ERROR", error);
    if (error instanceof Error && error.message.includes("429")) {
      return {
        status: 429,
        error: "API rate limit exceeded. Please try again later.",
      };
    }
    return { status: 500, error: "Internal Server Error" };
  }
};

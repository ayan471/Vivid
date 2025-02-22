"use server";

import { client } from "@/lib/prisma";
import { ContentItem, ContentType, Slide } from "@/lib/types";

import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

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

export const generateLayoutsJson = async (outlineArray: string[]) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `### Guidelines
  You are a highly creative AI that generates JSON-based layouts for presentations. I will provide you with a pattern and a format to follow, and for each outline, you must generate unique layouts and contents and give me the output in the JSON format expected.
  Our final JSON output is a combination of layouts and elements. The available LAYOUTS TYPES are as follows: "accentLeft", "accentRight", "imageAndText", "textAndImage", "twoColumns", "twoColumnsWithHeadings", "threeColumns", "threeColumnsWithHeadings", "fourColumns", "twoImageColumns", "threeImageColumns", "fourImageColumns", "tableLayout".
  The available CONTENT TYPES are "heading1", "heading2", "heading3", "heading4", "title", "paragraph", "table", "resizable-column", "image", "blockquote", "numberedList", "bulletList", "todoList", "calloutBox", "codeBlock", "tableOfContents", "divider", "column"

  Use these outlines as a starting point for the content of the presentations
    ${JSON.stringify(outlineArray)}

  The output must be an array of JSON objects.
    1. Write layouts based on the specific outline provided. Do not use types that are not mentioned in the example layouts.
    2. Ensuring each layout is unique.
    3. Adhere to the structure of existing layouts
    4. Fill placeholder data into content fields where required.
    5. Generate unique image placeholders for the 'content' property of image components and also alt text according to the outline.
    6. Ensure proper formatting and schema alignment for the output JSON.
  7. First create LAYOUTS TYPES  at the top most level of the JSON output as follows ${JSON.stringify(
    [
      {
        slideName: "Blank card",
        type: "blank-card",
        className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
        content: {},
      },
    ]
  )}

  8.The content property of each LAYOUTS TYPE should start with "column" and within the columns content property you can use any  of the CONTENT TYPES I provided above. Resizable-column, column and other multi element contents should be an array because you can have more elements inside them nested. Static elements like title and paragraph should have content set to a string.Here is an example of what 1 layout with 1 column with 1 title inside would look like:
  ${JSON.stringify([
    {
      slideName: "Blank card",
      type: "blank-card",
      className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
      content: {
        id: uuidv4(),
        type: "column",
        name: "Column",
        content: [
          {
            id: uuidv4(),
            type: "title",
            name: "Title",
            content: "",
            placeholder: "Untitled Card",
          },
        ],
      },
    },
  ])}

  9. Here is a final example of an example output for you to get an idea
  ${JSON.stringify([
    {
      id: uuidv4(),
      slideName: "Blank card",
      type: "blank-card",
      className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
      content: {
        id: uuidv4(),
        type: "column",
        name: "Column",
        content: [
          {
            id: uuidv4(),
            type: "title",
            name: "Title",
            content: "",
            placeholder: "Untitled Card",
          },
        ],
      },
    },
    {
      id: uuidv4(),
      slideName: "Accent left",
      type: "accentLeft",
      className: "min-h-[300px]",
      content: {
        id: uuidv4(),
        type: "column",
        name: "Column",
        restrictDropTo: true,
        content: [
          {
            id: uuidv4(),
            type: "resizable-column",
            name: "Resizable column",
            restrictToDrop: true,
            content: [
              {
                id: uuidv4(),
                type: "image",
                name: "Image",
                content:
                  "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                alt: "Title",
              },
              {
                id: uuidv4(),
                type: "column",
                name: "Column",
                content: [
                  {
                    id: uuidv4(),
                    type: "heading1",
                    name: "Heading1",
                    content: "",
                    placeholder: "Heading1",
                  },
                  {
                    id: uuidv4(),
                    type: "paragraph",
                    name: "Paragraph",
                    content: "",
                    placeholder: "start typing here",
                  },
                ],
                className: "w-full h-full p-8 flex justify-center items-center",
                placeholder: "Heading1",
              },
            ],
          },
        ],
      },
    },
  ])}

   For Images
    - The alt text should describe the image clearly and concisely.
    - Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects.
    - Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related).
    - Avoid using terms like "image of" or "picture of," and instead focus directly on the content and meaning.

    Output the layouts in JSON format. Ensure there are no duplicate layouts across the array.
  `;

  try {
    console.log("🟢 Generating layouts...");
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    });

    const response = await result.response;
    const responseContent = response.text();

    if (!responseContent) {
      return { status: 400, error: "No content generated" };
    }

    let jsonResponse;
    try {
      // Remove any potential markdown formatting and extra whitespace
      const cleanedContent = responseContent
        .replace(/```json\s*|\s*```/g, "")
        .replace(/^\s*|\s*$/g, "")
        .replace(/\n/g, "")
        .trim();

      // Attempt to find the start and end of the JSON array
      const startIndex = cleanedContent.indexOf("[");
      const endIndex = cleanedContent.lastIndexOf("]");

      if (startIndex === -1 || endIndex === -1) {
        throw new Error("Unable to find valid JSON array in the response");
      }

      const jsonString = cleanedContent.slice(startIndex, endIndex + 1);
      jsonResponse = JSON.parse(jsonString);

      if (!Array.isArray(jsonResponse)) {
        throw new Error("Parsed JSON is not an array");
      }

      await Promise.all(jsonResponse.map(replaceImagePlaceholders));
    } catch (error) {
      console.log("🔴 ERROR:", error);
      console.log("Raw response:", responseContent);
      return { status: 500, error: "Invalid JSON format received from AI" };
    }

    console.log("🟢 Layouts generated successfully");
    return { status: 200, data: jsonResponse };
  } catch (error) {
    console.error("🔴 ERROR:", error);
    if (error instanceof Error && error.message.includes("429")) {
      return {
        status: 429,
        error: "API rate limit exceeded. Please try again later.",
      };
    }
    return { status: 500, error: "Internal server error" };
  }
};

const findImageComponents = (layout: ContentItem): ContentItem[] => {
  const images = [];
  if (layout.type === "image") {
    images.push(layout);
  }
  if (Array.isArray(layout.content)) {
    layout.content.forEach((child) => {
      images.push(...findImageComponents(child as ContentItem));
    });
  } else if (layout.content && typeof layout.content === "object") {
    images.push(...findImageComponents(layout.content));
  }
  return images;
};

const generateImageUrl = async (
  prompt: string
): Promise<{ url: string; alt: string }> => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const improvedPrompt = `
    Create a highly descriptive alt text for an image based on the following description. The alt text should be detailed enough to convey the visual elements of the image as if it were a professional, realistic photograph.

    Description: ${prompt}

    Important Notes:
    - The alt text should describe a photorealistic style and visually compelling image.
    - Include details about lighting, shadows, and textures to make the description as lifelike as possible.
    - Avoid describing elements that appear abstract, cartoonish, or overly artistic. The description should be suitable for professional presentations.
    - Focus on accurately depicting the concept described, including specific objects, environment, mood, and context. Maintain relevance to the description provided.

    Example Use Cases: Business presentations, educational slides, professional designs.

    Provide the alt text in 50 words or less.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: improvedPrompt }] }],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.2,
      },
    });

    const response = await result.response;
    const altText = response.text().trim();

    // Generate a random ID for picsum photos
    const randomId = Math.floor(Math.random() * 1000);
    // Use picsum.photos which provides actual photographs
    const placeholderUrl = `https://picsum.photos/seed/${randomId}/1024/1024.jpg`;

    console.log("🟢 Alt text generated successfully:", altText);
    console.log("🟢 Generated image URL:", placeholderUrl);

    return { url: placeholderUrl, alt: altText };
  } catch (error) {
    console.error("Failed to generate alt text:", error);

    // Fallback to a specific picsum image if there's an error
    return {
      url: "https://picsum.photos/seed/fallback/1024/1024.jpg",
      alt: "A placeholder image for " + prompt,
    };
  }
};

// Optional: Add a function to validate the URL is accessible
const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Failed to validate image URL:", error);
    return false;
  }
};

// Modified replaceImagePlaceholders function with URL validation
const replaceImagePlaceholders = async (layout: Slide) => {
  const imageComponents = findImageComponents(layout.content);
  console.log("🟢 Found image components:", imageComponents);

  for (const component of imageComponents) {
    console.log("🟢 Generating image for component:", component.alt);
    const { url, alt } = await generateImageUrl(
      component.alt || "Placeholder Image"
    );

    // Validate the URL before assigning it
    const isValidUrl = await validateImageUrl(url);

    if (isValidUrl) {
      component.content = url;
      component.alt = alt;
    } else {
      // Fallback to a specific picsum image if validation fails
      component.content = "https://picsum.photos/seed/fallback/1024/1024.jpg";
      component.alt = alt;
    }

    console.log("🟢 Updated image component:", {
      content: component.content,
      alt: component.alt,
    });
  }
};

// const replaceImagePlaceholders = async (layout: Slide) => {
//   const imageComponents = findImageComponents(layout.content);
//   console.log("🟢 Found image components:", imageComponents);
//   for (const component of imageComponents) {
//     console.log("🟢 Generating image for component:", component.alt);
//     const { url, alt } = await generateImageUrl(
//       component.alt || "Placeholder Image"
//     );
//     component.content = url;
//     component.alt = alt; // Update the alt text with the generated one
//   }
// };

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project ID is required" };
    }
    const user = await currentUser();
    if (!user) {
      return { status: 403, error: "User not authenticated" };
    }
    const userExist = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userExist || !userExist.subscription) {
      return {
        status: 403,
        error: !userExist?.subscription
          ? "User does not have an active subscription"
          : "User not found iin  the database",
      };
    }
    const project = await client.project.findUnique({
      where: { id: projectId, isDeleted: false },
    });
    if (!project) {
      return { status: 404, error: "Project not found" };
    }
    if (!project.outlines || project.outlines.length === 0) {
      return { status: 400, error: "Project does not have any outlines" };
    }
    const layouts = await generateLayoutsJson(project.outlines);

    if (layouts.status !== 200) {
      return layouts;
    }

    await client.project.update({
      where: { id: projectId },
      data: { slides: layouts.data, themeName: theme },
    });
    return { status: 200, data: layouts.data };
  } catch (error) {
    console.error("🔴 ERROR", error);
    return { status: 500, error: "Internal server error", data: [] };
  }
};

const existingLayouts = [
  {
    id: uuidv4(),
    slideName: "Blank card",
    type: "blank-card",
    className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent left",
    type: "accentLeft",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      restrictDropTo: true,
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              content:
                "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Title",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent Right",
    type: "accentRight",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              restrictToDrop: true,
              content:
                "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Title",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Image and text",
    type: "imageAndText",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Image and text",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Title",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Text and image",
    type: "textAndImage",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Title",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns",
    type: "twoColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns with headings",
    type: "twoColumnsWithHeadings",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Three column",
    type: "threeColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },
];

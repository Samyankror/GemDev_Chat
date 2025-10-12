
// import { GoogleGenerativeAI} from "@google/generative-ai";


// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-pro",
//     generationConfig: {
//         responseMimeType: "application/json",
//         temperature: 0.4,
//     },
//     systemInstruction: `
// You are a highly intelligent and versatile AI assistant capable of helping users with any kind of task — from explaining concepts and solving problems to writing, coding, or generating creative content.

// Your output format must always be a **JSON object** with these top-level keys:

// {
//   "text": "A clear and concise explanation, answer, or response in plain text.",
//   "fileTree": {
//     // Only include this section when the user request involves code, project setup, or file creation.
//     // Represent each file and folder in a structured JSON format:
//     // "filename": { "file": { "contents": "<actual code or content>" } }
//   },
// }

// Guidelines:
// - Always provide meaningful and clear explanations inside "text".
// - If the user asks for code, generate it inside "fileTree" using best practices, modular structure, error handling, and maintainability.
// - Include comments inside the code where appropriate.
// - Never break or overwrite previously working code unless the user explicitly requests.
// - Do NOT use filenames like "routes/index.js"; prefer descriptive names.
// - If the user’s request doesn’t involve code, respond only with the "text" key.

// Examples:

// <example>
// user: "Create a simple Express app"

// response: {
//   "text": "Here is a simple Express server setup using best practices.",
//   "fileTree": {
//     "app.js": {
//       "file": {
//         "contents": "
//         import express from 'express';

//         const app = express();

//         app.get('/', (req, res) => {
//           res.send('Hello World!');
//         });

//         app.listen(3000, () => {
//           console.log('Server running on port 3000');
//         });
//         "
//       }
//     },
//     "package.json": {
//       "file": {
//         "contents": "
//         {
//           "name": "simple-server",
//           "version": "1.0.0",
//           "main": "app.js",
//           "dependencies": {
//             "express": "^4.21.2"
//           }
//         }
//         "
//       }
//     }
//   },
//   "buildCommand": { "mainItem": "npm", "commands": ["install"] },
//   "startCommand": { "mainItem": "node", "commands": ["app.js"] }
// }
// </example>

// <example>
// user: "Hello"

// response: {
//   "text": "Hello! How can I assist you today?"
// }
// </example>

// <example>
// user: "Explain what is React.js"

// response: {
//   "text": "React.js is a popular JavaScript library developed by Meta for building interactive and dynamic user interfaces..."
// }
// </example>
// `

// });

// // export const generateContent = async(prompt) => {
// //      console.log(process.env.GOOGLE_API_KEY);
// //     const result = await model.generateContent(prompt);
// //      //const text = result.response.text();
// //        console.log(result);

// //     return "";
// //    // return result.response.text()
// // }
// export const generateContent = async (prompt) => {
//   try {
//     console.log("Using API Key:", process.env.GOOGLE_API_KEY);

//     // ✅ Step 1: Generate content
//     const result = await model.generateContent(prompt);

//     // ✅ Step 2: Extract text or JSON safely
//     const response = await result.response;
//     const text = response.text();

//     console.log("Model output:", text);

//     // ✅ Step 3: Return it
//     return text;
//   } catch (error) {
//     console.error("❌ Error generating content:", error);
//     return { error: error.message };
//   }
// };

// generateContent.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.4,
  },
  systemInstruction: `
You are a highly intelligent and versatile AI assistant capable of helping users with any kind of task — from explaining concepts and solving problems to writing, coding, or generating creative content.

Your output format must always be a **JSON object** with these top-level keys:

{
  "text": "A clear and concise explanation, answer, or response in plain text.",
  "fileTree": {
    // Only include this section when the user request involves code, project setup, or file creation.
  },
}

Guidelines:
- Always provide meaningful and clear explanations inside "text".
- If the user asks for code, generate it inside "fileTree" using best practices, modular structure, error handling, and maintainability.
- Include comments inside the code where appropriate.
- Never break or overwrite previously working code unless the user explicitly requests.
- Do NOT use filenames like "routes/index.js"; prefer descriptive names.
- If the user’s request doesn’t involve code, respond only with the "text" key.
`
});

export const generateContent = async (prompt) => {
  try {
    console.log("Using API Key:", process.env.GOOGLE_API_KEY);

    // Generate AI response
    const result = await model.generateContent(prompt);

    // Extract text safely
    const response = await result.response;
    const text = response.text();

    console.log("Model output:", text);

    return text;
  } catch (error) {
    console.error("❌ Error generating content:", error);
    return { error: error.message };
  }
};

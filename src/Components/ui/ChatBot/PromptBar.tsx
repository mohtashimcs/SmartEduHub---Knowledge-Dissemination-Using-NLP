import { ImagePlus, SendHorizontal, X } from "lucide-react";
import { ChangeEvent,  useState } from "react";
import { textAreaAdjust } from "../Posts/PostOperation";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

//Props
interface Props {
  HandleData: any;
  Prompt: any;
}

//Component
export const PromptBar = ({ HandleData, Prompt }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [promptExecut, setPromptExecut] = useState(false);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };
  const [conversationHistory, setConversationHistory] = useState<any | null>(
    []
  );
  const addHistory = (text: string, handler: string) => {
    setConversationHistory((prevConversationHistory: string) => [
      ...prevConversationHistory,
      { text, handler },
    ]);
  };
  // Converts a File object to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(file: any) {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string; // Cast reader.result to string
        resolve(result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  const fetchImageResponse = async (userMessage: string, file: File) => {
    console.log("FileParameter", file);
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const genAI = new GoogleGenerativeAI(
      `${import.meta.env.VITE_CHATBOT_API_KEY}`
    );
    try {
      setPromptExecut(true);
      Prompt(true);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const prompt = userMessage;
      const imageParts = await fileToGenerativePart(file);
      const result = await model.generateContent([prompt, imageParts]);
      const response = await result.response;
      const text = await response.text();
      console.log(text);
      addHistory(userMessage, "user");
      addHistory(text, "model");
      // Check if the response is code before updating messages
      const isCode = text.includes("```");
      HandleData(text, true, isCode, true);
      Prompt(false);
      setPromptExecut(false);
    } catch (error) {
      Prompt(false);
      setPromptExecut(false);
      HandleData("Sorry, I couldn't understand that.", true, false, true);
    } finally {
      setPromptExecut(false);
    }
  };

  const fetchBotResponse = async (userMessage: string) => {
    setPromptExecut(true);
    const genAI = new GoogleGenerativeAI(
      `${import.meta.env.VITE_CHATBOT_API_KEY}`
    );
    const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 32000,
      temperature: 0.5,
      topP: 0.1,
      topK: 16,
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });
    const formattedHistory = conversationHistory.map((entry: any) => ({
      role: entry.handler,
      parts: [{ text: entry.text }], // Ensure parts is an array of objects with a text field
    }));
    // Assuming GoogleGenerativeAI is correctly imported and configured
    Prompt(false);
    setPromptExecut(false);

    try {
      setPromptExecut(true);
      Prompt(true);
      if (
        userMessage.match(
          /\b(introduce (yourself|u)|who (are|r) (you|u)|what('| i)s your (name))\b/i
        )
      ) {
        const customResponse =
          "My name is SmartEduHub. I am an AI model developed by student of COMSATS, designed to assist with a variety of language-related tasks, including answering questions, generating text, and more. While I'm always learning and expanding my capabilities, my primary goal is to assist and provide information. How can I help you today?"; // Custom response
        addHistory(userMessage, "user");
        addHistory(customResponse, "model");
        HandleData(customResponse, true, false, false);
        Prompt(false);
        setPromptExecut(false);
      } else {
        const chat = model.startChat({
          generationConfig,
          history: formattedHistory,
          safetySettings,
        });
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = await response.text(); // Make sure to await the .text() method
        // Update conversation history with the user's message and model's response
        addHistory(userMessage, "user");
        addHistory(text, "model");
        // Check if the response is code before updating messages
        const isCode = text.includes("```");
        HandleData(text, true, isCode, false); // true indicates the message is from the bot
        Prompt(false);
        setPromptExecut(false);
      }
    } catch (error) {
      Prompt(false);
      setPromptExecut(false);
      HandleData("Sorry, I couldn't understand that.", true, false, false);
    } finally {
      setPromptExecut(false);
    }
  };

  const sendMessage = async (e: any) => {
    e.preventDefault(); // Prevent form submission if wrapped in a form
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage && !selectedFile) return; // Don't send empty messages
    if (!selectedFile) {
      HandleData(trimmedMessage);
    } // Add user message
    else {
      HandleData(trimmedMessage, false, false, true);
    }
    setInputMessage(""); // Clear input field
    if (!selectedFile) {
      await fetchBotResponse(trimmedMessage);
    } else {
      fetchImageResponse(trimmedMessage, selectedFile); // Pass selectedFile directly
    }
  };

  return (
    <div className="relative flex items-center space-x-2 w-full max-w-lg overflow-hidden">
      {selectedFile && (
        <button
          className="absolute size-4 bottom-6 left-4 bg-transparent text-black border-2 border-gray-300 hover:bg-blue-50 cursor-pointer m-2"
          onClick={handleRemoveFile}
        >
          <X className="size-5" />
        </button>
      )}
      <div>
        {selectedFile ? (
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected Image"
            className="size-8 rounded-md border-blue-600"
          />
        ) : (
          <div className="absolute left-6 top-2">
            <label
              htmlFor="imageChat"
              id="labelImage"
              className="cursor-pointer"
            >
              <ImagePlus className="text-gray-700" />
            </label>
            <input
              type="file"
              id="imageChat"
              name="imageChat"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      <textarea
        className="w-full text-base poppins-regular border-2 rounded-3xl pl-12 pr-20 py-2 resize-none outline-none focus:outline-none border-transparent overflow-hidden"
        onInput={(e) => textAreaAdjust(e.target as HTMLTextAreaElement)}
        onChange={(e) => setInputMessage(e.target.value)}
        disabled={promptExecut}
        onKeyDown={(e) => {
          // Check if the Enter key is pressed and also ensure that the Shift key is not pressed.
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent the default action (insert newline) from happening.
            sendMessage(e); // Call your send message function here.
          }
        }}
        value={inputMessage}
        placeholder="Type your query here..."
        rows={1} // Start with a single line.
        style={{ paddingRight: "50px" }} // Adjust based on the size of your send button
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
        <SendHorizontal
          onClick={sendMessage}
          className="size-7 text-green-700"
        />
      </div>
    </div>
  );
};

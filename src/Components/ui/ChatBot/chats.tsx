import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { PromptBar } from "./PromptBar";
import { ResponseView } from "./ResponseView";

function Chats() {
  const [messages, setMessages] = useState<any | null>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isPromptRunning, setIsPromptRunning] = useState(false);
  const getPromptRunning = (data: boolean) => {
    setIsPromptRunning(data);
  };

  useEffect(() => {
    // Auto-scroll to the bottom of the chat container when new messages are added
    chatContainerRef.current!.scrollTop =
      chatContainerRef.current!.scrollHeight;
  }, [messages]);
  const getData = (
    text: string,
    isBot = false,
    isCode = false,
    hasImage = false
  ) => {
    setMessages((prevMessages: string) => [
      ...prevMessages,
      { text, isBot, isCode, hasImage },
    ]);
  };

  return (
    <div className="w-full mt-1 space-y-2 flex border-gray-400 flex-col items-center">
      <div className="w-[90%] h-screen">
        <Card className="border-2 shadow-2xl bg-[#c2e5f3] border-gray-400 rounded-3xl h-[90%] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>
              <div className="poppins-bold flex flex-col items-center">
                <span>ChatBot</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent
            className="px-4 py-2 flex-1 w-full overflow-y-auto border-t-2 border-b-2 rounded-lg border-t-gray-300 border-b-gray-400 bg-[#cee5ee] [&::-webkit-scrollbar]:hidden"
            style={{ maxHeight: "500px" }}
            ref={chatContainerRef}
          >
            <ResponseView Chats={messages} PromptRunning={isPromptRunning} />
          </CardContent>
          <CardFooter className="flex justify-center mt-4 pb-4">
            <PromptBar HandleData={getData} Prompt={getPromptRunning} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Chats;

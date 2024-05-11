import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MDEditor from "@uiw/react-md-editor";
import { Bot } from "lucide-react";
import { SyncLoader } from "react-spinners";

interface Props {
  Chats: string[];
  PromptRunning: boolean;
}

export const ResponseView = ({ Chats, PromptRunning }: Props) => {
  const formatResponseText = (text: string) => {
    // Replace '##' with '<br>'
    let formattedText = text.replace(/##/g, "<br>");

    // Replace '**word**' with '<strong>word</strong>'
    formattedText = formattedText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    // Replace '_word_' with '<em>word</em>'
    formattedText = formattedText.replace(/_(.*?)_/g, "<em>$1</em>");

    // Replace '*word*' with '<em>word</em>'
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return formattedText;
  };
  return (
    <div
      className="flex flex-col overflow-y-auto text-wrap space-y-4 p-4 w-full justify-end"
      //ref={chatContainerRef}
    >
      {Chats.map((message: any, index: number) => (
        <div
          key={index}
          className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`flex space-x-2 items-end ${
              message.isBot ? "bg-[#87ceeb]" : "bg-[#85f9bc]"
            } w-fit rounded-md p-2`}
          >
            {message.isBot && (
              <Avatar className="size-8">
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              {/* {message.hasImage && (
                <span className="poppins-extralight text-xs">
                  Query from Image
                </span>
              )} */}
              {message.isCode ? (
                <MDEditor.Markdown
                  source={message.text}
                  style={{ whiteSpace: "pre-wrap text-wrap" }}
                  className="rounded-xl text-wrap "
                />
              ) : (
                <span
                  className={`text-base poppins-regular font-thin ${
                    message.isBot ? "text-left" : "text-right"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatResponseText(message.text),
                  }}
                ></span>
              )}
              <span className="font-extralight text-xs text-right">
                {message.isBot ? "Bot" : "You"} |{" "}
                {new Date().toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}

      {PromptRunning && (
        <div className="w-full flex flex-col space-y-2 justify-center items-center bg-transparent">
          <SyncLoader color="#89CFF3" />
          <span className="poppins-light text-xs">
            Fetching response from gemini
          </span>
        </div>
      )}
    </div>
  );
};

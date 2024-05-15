import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareDot, SendHorizontal } from "lucide-react";
import { PacmanLoader } from "react-spinners";
import { textAreaAdjust, userSentiment } from "./PostOperation";
import { useEffect, useState } from "react";
import { db } from "@/src/Firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { UserComments } from "./UserComments";
import { useAppSelector } from "@/src/app/hooks";
import commentSound from "/comment_sound.m4a";
interface Props {
  PostId: string;
}
export const CommentView = ({ PostId }: Props) => {
  const profile = useAppSelector((state) => state.profile.picture);
  const userId = useAppSelector((state) => state.profile.userId);
  const [commenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [postId, setPostId] = useState<string | null>(null);
  const handleCommentClick = (clickedPostId: any) => {
    setPostId(clickedPostId);
  };
  useEffect(() => {
    if (!postId) return;
    setIsCommenting(true);
    const fetchComments = async () => {
      setIsCommenting(true);
      const commentsRef = collection(db, "posts", postId, "comments");
      const q = query(commentsRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const commentsPromises = querySnapshot.docs.map(async (docSnapshot) => {
          // Renamed from doc to docSnapshot
          const commentData = docSnapshot.data();

          return {
            id: docSnapshot.id,
            ...commentData,
          };
        });

        const commentsWithUserNames = await Promise.all(commentsPromises);
        setComments(commentsWithUserNames);
        setIsCommenting(false);
      });
      setIsCommenting(false);
      return () => unsubscribe();
    };

    fetchComments();
  }, [postId]);
  function play() {
    new Audio(commentSound).play();
  }
  const sendComment = async (postId: any) => {
    if (!commentText.trim()) return; // Prevent empty comments
    let resp = "";
    try {
      setDisableButton(true);
      setIsCommenting(true);
      userSentiment({ inputs: commentText }).then(async (response) => {
        const firstOutput = response[0][0]; // Access the first element of the nested structure
        resp = firstOutput.label; // Extract the label from the first output
        if (resp == "positive" || resp == "neutral") {
          play();
          setCommentText("");
          // Reference to the 'comments' subcollection inside the post document
          const commentsCollectionRef = collection(
            db,
            "posts",
            postId,
            "comments"
          );

          // Add a new comment document to the 'comments' subcollection
          await addDoc(commentsCollectionRef, {
            text: commentText,
            authorId: userId,
            createdAt: serverTimestamp(),
            userName: localStorage.getItem("userName"),
            userPic: profile,
          });
          const postRef = doc(db, "posts", postId);

          // Atomically increment the comments count
          await updateDoc(postRef, {
            comments: increment(1),
          });
          setIsCommenting(false);

          toast({
            className: "bg-[#87CEEB] poppins-bold",
            variant: "default",
            title: "Success.",
            description: "Comment added successfully. ",
          });
        } else if (resp == "negative") {
          setIsCommenting(false);
          toast({
            className: "poppins-bold",
            variant: "destructive",
            title: "OOPs!",
            description: "Negative comments are not allowed.",
          });
        } else {
          setIsCommenting(false);
          toast({
            className: "poppins-bold",
            variant: "default",
            description: "Something went wrong please try again.",
          });
        }
      });

      // Optionally, clear the input field and handle any UI updates here
    } catch (error) {
      console.error("Error adding comment: ", error);
      // Handle errors, e.g., by showing an error message to the user
    } finally {
      setDisableButton(false);
      setIsCommenting(false);
    }
  };
  const [disableButton, setDisableButton] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <Dialog>
        <DialogTrigger>
          <Button
            className="poppins-semibold border-2 border-gray-400 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-300 hover:text-black space-x-1 hover:border-dotted hover:border-gray-500"
            onClick={() => handleCommentClick(PostId)}
          >
            <MessageSquareDot className="pr-1" />
            Comment
          </Button>
        </DialogTrigger>
        <DialogContent className="h-5/6 overflow-auto [&::-webkit-scrollbar]:hidden bg-[#CDF5FD]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Insights on this post.
            </DialogTitle>
            <DialogDescription className="space-y-4 ">
              <div className="relative">
                <Textarea
                  disabled={disableButton}
                  className="px-6 pr-10 py-2 border-2 resize-none placeholder:text-muted-foreground poppins-regular text-md bg-slate-100 rounded-3xl overflow-hidden border-blue-500 focus-visible:ring-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray focus-within:border-blue-700 transition-all duration-200 text-gray outline-none shadow-inner"
                  onKeyUp={(e) => {
                    // Adjust the textarea height first
                    textAreaAdjust(e.target as HTMLTextAreaElement);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendComment(PostId);
                      setCommentText("");
                    }
                  }}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Fuel the discussion..."
                />
                <button
                  className="absolute right-4  bottom-2 text-blue-500 hover:text-red-600"
                  // Define this function to handle comment submission
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevents the default action of the event.
                    sendComment(PostId); // Call the async function without returning its promise.
                  }}
                >
                  <SendHorizontal className="size-7" />
                </button>
              </div>
              {commenting ? (
                <div className="fixed inset-0 flex justify-center items-center bg-[rgba(255,255,255,0.8)]">
                  <PacmanLoader color="#36d7b7" />
                </div>
              ) : (
                <UserComments Comments={comments} />
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
  getDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { db } from "@/src/Firebase/firebase";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Paperclip, SendHorizontal } from "lucide-react";
import { textAreaAdjust } from "../../Posts/PostOperation";
import { toast } from "@/components/ui/use-toast";
import { useAppSelector } from "@/src/app/hooks";
//-------------------------------------------
export const ChatView = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const ContainerRef = useRef<HTMLDivElement>(null);
  const profilePic = useAppSelector((state) => state.profile.picture);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat container when new messages are added
    if (ContainerRef.current) {
      ContainerRef.current.scrollTop = ContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const handleGroupClick = (clickedGroupId: string) => {
    //setMessages([]);
    clickedGroupId.trim();
    setSelectedGroup(clickedGroupId.trim());
  };
  const handleClose = () => {
    setMessages([]);
    setSelectedGroup(null);
  };

  const sendMessage = async (groupId: string) => {
    if (!messageText.trim()) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Messages cannot be empty. ",
      });
      return;
    } // Prevent sending empty messages

    try {
      const message = {
        text: messageText,
        sentBy: userUid, // Assuming you have the current user's UID
        sentAt: new Date(), // Use Firestore server timestamp
        readBy: [], // Initialize as empty; update when read
        profilePic: profilePic,
      };
      // Reference to the messages subcollection within the selected group
      const messagesRef = collection(db, "groups", groupId, "messages");

      // Add the message document to Firestore
      await addDoc(messagesRef, message);
      const groupRef = doc(db, "groups", groupId);

      // Update the lastMessage attribute in the parent group document
      await updateDoc(groupRef, {
        lastMessage: message.text, // or any other relevant information from the message
      });

      setMessageText(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    if (!selectedGroup) return;

    const messagesRef = collection(db, "groups", selectedGroup, "messages");
    const q = query(messagesRef, orderBy("sentAt", "asc"));

    // Subscribe to document changes
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      let changes = querySnapshot.docChanges();

      const fetchedMessagesPromises = changes.map(async (change) => {
        // Focus on added messages to update in real-time
        if (change.type === "added") {
          const docSnapshot = change.doc;
          const messageData = docSnapshot.data();

          // Fetch user username, similar to previous logic
          const sentByUid = messageData.sentBy;
          let userData = {}; // Default to empty if not found
          if (sentByUid) {
            const userQuery = query(
              collection(db, "users"),
              where("uid", "==", sentByUid)
            );
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
              userData = userSnapshot.docs[0].data(); // Fetch the username specifically
            }
          }
          return { id: docSnapshot.id, user: userData, ...messageData }; // Attach username under user object
        }
        return null;
      });

      const fetchedMessages = (
        await Promise.all(fetchedMessagesPromises)
      ).filter((m) => m !== null);

      // Only add new messages if there are any
      if (fetchedMessages.length > 0) {
        setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts or the selectedGroup changes
    return () => unsubscribe();
  }, [db, selectedGroup]);
  const [groups, setGroups] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  const userUid = localStorage.getItem("uid");
  useEffect(() => {
    if (!userUid) {
      console.error("No authenticated user found.");
      return; // Authentication check
    }
    // Fetch user data
    const fetchUserData = async () => {
      const userDocRef = query(
        collection(db, "users"),
        where("uid", "==", userUid)
      );
      const userDocSnap = await getDocs(userDocRef);
      if (!userDocSnap.empty) {
        const userData = userDocSnap.docs[0].data();
        fetchGroupsData(userData.groups);
      } else {
        return;
      }
    };

    // Fetch group data for each group ID
    const fetchGroupsData = async (groupIds: string[]) => {
      const fetchedGroups = [];

      // Loop through the groupIds array to fetch each document.
      for (const groupId of groupIds) {
        const cleanGroupId = groupId.trim();
        const groupDocRef = doc(db, "groups", cleanGroupId);
        const groupDocSnap = await getDoc(groupDocRef);

        if (groupDocSnap.exists()) {
          // Add the group data to the fetchedGroups array, including its document ID.
          fetchedGroups.push({ id: groupDocSnap.id, ...groupDocSnap.data() });
        } else {
          return;
        }
      }
      setGroups(fetchedGroups);
    };

    fetchUserData();
  }, [userUid]);
  //delete a group
  const leaveGroup = async (groupId: string) => {
    try {
      const userUid = localStorage.getItem("uid");
      if (!userUid) {
        console.error("No authenticated user found.");
        return;
      }

      // Fetch the user document
      const userQuery = query(
        collection(db, "users"),
        where("uid", "==", userUid)
      );
      const userDocSnap = await getDocs(userQuery);

      if (!userDocSnap.empty) {
        // Get the user document reference
        const userDocRef = doc(db, "users", userDocSnap.docs[0].id);

        // Fetch the current groups array from the user document
        const userDocData = userDocSnap.docs[0].data();
        const updatedGroups = userDocData.groups.filter(
          (group: string) => group !== groupId
        );

        // Update the user document with the modified groups array
        await updateDoc(userDocRef, { groups: updatedGroups });

        // Refresh the page to reflect the changes
        window.location.reload();
      } else {
        console.error("User document not found.");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };
  return (
    <div className="w-full">
      {groups.map((group) => (
        <Drawer key={group.id} onClose={handleClose}>
          <DrawerTrigger asChild className="w-full">
            <div
              key={group.id}
              className="flex items-center space-x-4 p-2 bg-[#bce0ee] rounded-md my-2" // Added my-2 for margin, adjust as needed
              onClick={() => handleGroupClick(group.id)}
            >
              <Avatar className="w-12 h-12">
                {group.icon ? (
                  <AvatarImage src={group.icon} />
                ) : (
                  <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-left poppins-semibold">{group.name}</span>
                <span className="text-sm poppins-light text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-44">
                  {group.lastMessage
                    ? group.lastMessage
                    : "No message available"}
                </span>
              </div>
            </div>
          </DrawerTrigger>

          <DrawerContent className="h-[85vh] bg-[#dfe3ee]">
            <DrawerHeader className="">
              <DrawerTitle>
                <div className="flex items-center justify-center space-x-0">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-10 h-10">
                      {group.icon ? (
                        <AvatarImage src={group.icon} />
                      ) : (
                        <AvatarFallback>
                          {group.name.substring(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span
                      className="pl-2 poppins-bold"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      {group.name}
                    </span>
                  </div>

                  <div className="pb-8 pl-0 ">
                    <DrawerClose
                      asChild
                      onClick={handleClose}
                      className="bg-gray-200 rounded-md border-2 border-blue-500 cursor-pointer hover:bg-slate-400 hover:text-white"
                    >
                      <X />
                    </DrawerClose>
                  </div>
                </div>
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <div className=" flex justify-center h-3/4 overflow-hidden border-2 border-blue-400 rounded-3xl bg-[#89CFF3] ">
              {messages.length === 0 ? (
                <div className="flex justify-center items-end p-2">
                  <span className="text-gray-500 text-xl poppins-light">
                    Start a conversation
                  </span>
                </div>
              ) : (
                <div
                  className="flex flex-col bg-[#CDF5FD] h-full space-y-2 p-2 max-h-full  w-[40%] rounded-xl text-wrap overflow-hidden overflow-y-auto"
                  id="chatContainer"
                  ref={ContainerRef}
                >
                  {messages.map((message, index) => {
                    // Assume currentUserUid holds the UID of the current user
                    const isCurrentUserSender = message.sentBy === userUid;

                    return (
                      <div
                        key={index}
                        className={`flex space-x-2 m-4 border-2 border-blue-300 ${
                          isCurrentUserSender
                            ? "flex-row-reverse space-x-reverse"
                            : "flex-row"
                        } items-end w-fit rounded-md p-2 ${
                          isCurrentUserSender
                            ? "bg-[#c0f3d7] ml-auto"
                            : "bg-[#87ceeb] mr-auto"
                        }`}
                      >
                        <Avatar className="size-8 border-2 border-gray-400 overflow-hidden">
                          {message.user.profilePic ? (
                            <AvatarImage src={message.profilePic} />
                          ) : (
                            <AvatarFallback>
                              {message.user.name
                                ? message.user.name.substring(0, 2)
                                : "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col break-words max-w-sm">
                          <span
                            className={`poppins-regular text-sm ${
                              isCurrentUserSender ? "text-right" : "text-left"
                            }`}
                          >
                            {message.text} {/* Display the message content */}
                          </span>
                          <Separator className="bg-gray-400"></Separator>
                          <span
                            className={`poppins-thin text-gray-500 text-xs ${
                              isCurrentUserSender ? "text-right" : "text-left"
                            }`}
                          >
                            <span className="poppins-semibold text-gray-600">
                              {message.user.userName}
                            </span>
                            &ensp;
                            {new Date(message.sentAt?.toDate()).toLocaleString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DrawerFooter className="w-full">
              <div className="flex flex-col items-center space-y-2 mt-0">
                <div className="flex flex-grow items-center  p-2 rounded-3xl bg-[#b0dde6] border-2 border-blue-400">
                  <label htmlFor="file-input">
                    <span className="material-icons cursor-pointer text-blue-600">
                      <Paperclip />
                    </span>
                  </label>
                  <input id="file-input" type="file" className="hidden" />

                  <textarea
                    className="flex-grow poppins-light bg-transparent p-2 outline-none w-96 resize-none overflow-hidden"
                    placeholder="Type a message..."
                    onInput={(e) =>
                      textAreaAdjust(e.target as HTMLTextAreaElement)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(group.id);
                        setMessageText("");
                      }
                    }}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={1}
                  />

                  <span
                    className="material-icons cursor-pointer text-green-500"
                    onClick={() => sendMessage(group.id)}
                  >
                    <SendHorizontal className="text-green-600 size-7" />
                  </span>
                </div>
                <div className="flex space-x-2">
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="bg-[#87CEEB] poppins-semibold border-gray-600 border-2  text-black hover:bg-slate-300 border-dashed hover:border-double"
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                  </DrawerClose>
                  <Button
                    className="poppins-semibold hover:bg-red-200 hover:text-black border-gray-600 border-2  text-black border-dotted hover:border-double"
                    variant={"destructive"}
                    onClick={() => leaveGroup(group.id)}
                  >
                    Leave Group
                  </Button>
                </div>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
};

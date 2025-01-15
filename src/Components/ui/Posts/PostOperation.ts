import { db } from "@/src/Firebase/firebase";
import { useAppSelector } from "@/src/app/hooks";
import {
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import music from "/like_sound.m4a";

export const textAreaAdjust = (element: HTMLTextAreaElement) => {
  element.style.height = "inherit";
  element.style.height = `${element.scrollHeight}px`;
};

export const userSentiment = async (data: any) => {
  const response = await fetch(`https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest`, {
    headers: {
      Authorization: `Bearer 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`,
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};

export const useLikePost = (postId: string, userId: string) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Function to toggle the like state of a post
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      if (!postSnapshot.exists()) {
        console.error("Post does not exist");
        return;
      }

      const post = postSnapshot.data();
      if (post.likesBy && post.likesBy.includes(userId)) {
        play();
        await updateDoc(postRef, {
          likes: increment(-1),
          likesBy: post.likesBy.filter((id: any) => id !== userId),
        });
        setIsLiked(false);
      } else {
        play();
        await updateDoc(postRef, {
          likes: increment(1),
          likesBy: [...(post.likesBy || []), userId],
        });

        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Effect to set the initial state of isLiked when the component mounts or postId changes
  useEffect(() => {
    const checkIfLiked = async () => {
      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        const post = postSnapshot.data();
        setIsLiked(post.likesBy?.includes(userId));
      }
    };
    checkIfLiked();
  }, [postId, userId]);
  return { isLiking, isLiked, handleLike };
};
function play() {
  new Audio(music).play();
}
export const useFetchPosts = (fetchAll: boolean, fetchId: string) => {
  //let latestDoc: any = null;
  //const userId = localStorage.getItem("uid");
  const userId = localStorage.getItem("uid");
  const catg = useAppSelector((state) => state.profile.category);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [hasPost, setHasPost] = useState(false);

  //------------------------
  const fetchPost = () => {
    if (!userId) {
      setLoading(false);
      setHasPost(false);
      return;
    }

    if (userId && catg) {
      setLoading(true);
      setHasPost(false);
      let q;
      if (fetchAll) {
        q = query(
          collection(db, "posts"),
          where("category", "==", catg),
          orderBy("createdAt", "desc")
          //startAfter(latestDoc || 0),
          //limit(1)
        );
      } else {
        if (fetchId === userId) {
        }
        console.log("fetchAll");
        q = query(
          collection(db, "posts"),
          where("userId", "==", fetchId),
          orderBy("createdAt", "desc")
          //startAfter(latestDoc || 0),
          //limit(3)
        ); // Fetch all posts
      }
      if (fetchAll) {
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const allPosts = querySnapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .filter((post) => (post as any).userId != userId);
            setPosts(allPosts);
            // if (allPosts.length > 0) {
            //   latestDoc = allPosts[allPosts.length - 1];
            // }
            setHasPost(allPosts.length > 0);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching posts:", error);
            setLoading(false);
          }
        );

        // Cleanup function to unsubscribe from the listener on component unmount
        return () => unsubscribe();
      } else {
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const allPosts = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setPosts(allPosts);
            // if (allPosts.length > 0) {
            //   latestDoc = allPosts[allPosts.length - 1];
            // }
            setHasPost(allPosts.length > 0);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching posts:", error);
            setLoading(false);
          }
        );

        // Cleanup function to unsubscribe from the listener on component unmount
        return () => unsubscribe();
      }
    }
  };
  //------------------------
  useEffect(() => {
    setTimeout(() => {
      fetchPost();
    }, 200);
  }, [db, userId, catg, fetchAll, fetchId]);

  return { loading, posts, hasPost, fetchPost };
};

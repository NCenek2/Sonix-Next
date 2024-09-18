import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PostWithRelations } from "../api/posts/route";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";

type Replies = {
  postId: string;
  replies: PostWithRelations[];
  setReplies: Dispatch<SetStateAction<PostWithRelations[]>>;
};

const Replies = ({ postId, replies, setReplies }: Replies) => {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const fetchPosts = async () => {
    try {
      const response = await axios(`/api/posts?parentId=${postId}`);
      const newPosts = response.data;
      setReplies(newPosts);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch initial posts
  }, []);

  if (isLoading) {
    return <h1 className="text-white text-center">Loading...</h1>;
  }

  return (
    <div className="flex flex-col gap-1">
      {replies.map((reply) => (
        <Post
          key={reply.id}
          {...reply}
          session={session!}
          setPosts={setReplies}
        />
      ))}
    </div>
  );
};

export default Replies;

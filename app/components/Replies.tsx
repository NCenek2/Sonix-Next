import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PostWithRelations } from "../api/posts/route";
import axios from "axios";
import ReactionButtons from "./ReactionButtons";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Replies = {
  postId: string;
  replies: PostWithRelations[];
  setReplies: Dispatch<SetStateAction<PostWithRelations[]>>;
};

const Replies = ({ postId, replies, setReplies }: Replies) => {
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const {
    user: { image },
  } = session!;

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
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {replies.map((reply) => (
        <div
          key={reply.id}
          className="flex flex-col pl-4 p-1 rounded-md bg-slate-100 text-black"
        >
          <div className="flex items-center mb-2">
            <Image
              className="h-8 w-8 rounded-full mr-4"
              width={30}
              height={30}
              src={image ?? "/favicon.ico"}
              alt="profile-image"
            />
            <p>{reply.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Replies;

import { PostDislike, PostLike } from "@prisma/client";
import { PostWithRelations } from "../api/posts/route";
import ReactionButtons from "./ReactionButtons";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";
import axios from "axios";
import Replies from "./Replies";

type PostProps = PostWithRelations & {
  session: Session;
  setPosts: Dispatch<SetStateAction<PostWithRelations[]>>;
};

const Post = ({
  id: postId,
  userId: posterId,
  likes,
  dislikes,
  user: { image },
  message,
  replyCount,
  parentId,
  session,
  setPosts,
}: PostProps) => {
  const {
    user: { id: sessionUserId },
  } = session!;

  const [replies, setReplies] = useState<PostWithRelations[]>([]);
  const [showReplyTextArea, setShowReplyTextArea] = useState(false);
  const [showingReplies, setShowingReplies] = useState(false);
  const [reply, setReply] = useState("");
  const [hasCommented, setHasCommented] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = {
      userId: sessionUserId,
      message: reply,
      parentId: postId,
    };
    try {
      const returnedPost: any = await axios("/api/post", {
        data,
        method: "POST",
      });
      setReplies((prevReplies) => [returnedPost.data.post, ...prevReplies]);
      setHasCommented(true);
      setReply("");
      setShowReplyTextArea(false);
    } catch (error: unknown) {
      console.log("There was an error", error);
    }
  }

  const liked: PostLike | undefined = likes.find(
    (p) => p.userId === sessionUserId
  );
  const disliked: PostDislike | undefined = dislikes.find(
    (p) => p.userId === sessionUserId
  );
  return (
    <div className="flex flex-col p-3 rounded-md bg-slate-100 text-black">
      <div className="flex mb-2">
        <Image
          className="h-8 w-8 rounded-full mr-4"
          width={30}
          height={30}
          src={image ?? "/favicon.ico"}
          alt="profile-image"
        />
        <p>{message}</p>
      </div>
      <ReactionButtons
        postId={postId}
        posterId={posterId}
        parentId={parentId}
        initialLike={liked}
        initialDislike={disliked}
        setPosts={setPosts}
        setShowReplyTextArea={setShowReplyTextArea}
      />
      {(replyCount > 0 || hasCommented) && (
        <button onClick={() => setShowingReplies((p) => !p)}>
          <div className="flex justify-center text-gray-700">
            {showingReplies ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </div>
        </button>
      )}
      {showReplyTextArea && (
        <form onSubmit={handleSubmit}>
          <textarea
            id="message"
            name="message"
            value={reply}
            rows={2}
            className="block p-1 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-1"
            onChange={(e) => setReply(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowReplyTextArea(false)}>
              Cancel
            </button>
            <button type="submit">Reply</button>
          </div>
        </form>
      )}
      {showingReplies && (
        <Replies postId={postId} replies={replies} setReplies={setReplies} />
      )}
    </div>
  );
};

export default Post;

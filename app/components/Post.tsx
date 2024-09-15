import { PostDislike, PostLike } from "@prisma/client";
import { PostWithRelations } from "../api/posts/route";
import ReactionButtons from "./ReactionButtons";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";
import Replies from "./Replies";
import ReplyForm from "../posts/ReplyForm";
import ReplyButton from "../posts/ReplyButton";

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

  const liked: PostLike | undefined = likes.find(
    (p) => p.userId === sessionUserId
  );
  const disliked: PostDislike | undefined = dislikes.find(
    (p) => p.userId === sessionUserId
  );
  return (
    <div className="flex flex-col gap-1">
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
        {(replyCount > 0 || replies.length > 0) && (
          <ReplyButton
            showingReplies={showingReplies}
            onClick={() => setShowingReplies((p) => !p)}
          />
        )}
        {showReplyTextArea && (
          <ReplyForm
            postId={postId}
            sessionUserId={sessionUserId}
            setReplies={setReplies}
            setShowReplyTextArea={setShowReplyTextArea}
          />
        )}
      </div>
      {showingReplies && (
        <Replies postId={postId} replies={replies} setReplies={setReplies} />
      )}
    </div>
  );
};

export default Post;

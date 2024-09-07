import { PostDislike, PostLike } from "@prisma/client";
import { PostWithRelations } from "../api/posts/route";
import ReactionButtons from "./ReactionButtons";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { Session } from "next-auth";

type PostProps = PostWithRelations & {
  session: Session;
  setPosts: Dispatch<SetStateAction<PostWithRelations[]>>;
};

const Post = ({
  id: postId,
  userId: posterId,
  user: { image },
  likes,
  dislikes,
  message,
  session,
  setPosts,
}: PostProps) => {
  const {
    user: { id: sessionUserId },
  } = session!;

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
        initialLike={liked}
        initialDislike={disliked}
        setPosts={setPosts}
      />
    </div>
  );
};

export default Post;

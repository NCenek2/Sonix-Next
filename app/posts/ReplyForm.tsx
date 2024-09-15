import axios from "axios";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { PostWithRelations } from "../api/posts/route";

type ReplyFormProps = {
  postId: string;
  sessionUserId: string;
  setReplies: Dispatch<SetStateAction<PostWithRelations[]>>;
  setShowReplyTextArea: Dispatch<SetStateAction<boolean>>;
  setHasCommented: Dispatch<SetStateAction<boolean>>;
};

const ReplyForm = ({
  postId,
  sessionUserId,
  setReplies,
  setShowReplyTextArea,
  setHasCommented,
}: ReplyFormProps) => {
  const [reply, setReply] = useState("");

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

  return (
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
  );
};

export default ReplyForm;

import axios from "axios";
import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { PostWithRelations } from "../api/posts/route";
import { PostData } from "../components/Post";

type ReplyFormProps = {
  postId: string;
  sessionUserId: string;
  setPosts: Dispatch<SetStateAction<PostWithRelations[]>>;
  setReplies: Dispatch<SetStateAction<PostWithRelations[]>>;
  textArea: PostData;
  setTextArea: Dispatch<SetStateAction<PostData>>;
};

const ReplyForm = ({
  postId,
  sessionUserId,
  setPosts,
  setReplies,
  textArea,
  setTextArea,
}: ReplyFormProps) => {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = {
      userId: sessionUserId,
      message: textArea.message,
      postId: textArea.postId,
      parentId: postId,
    };

    const method = data.postId ? "PATCH" : "POST";

    try {
      const returnedPost: any = await axios("/api/post", {
        data,
        method,
      });
      if (method === "POST") {
        setReplies((prevReplies) => [returnedPost.data.post, ...prevReplies]);
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (data.postId === post.id) {
              return returnedPost.data.post;
            }

            return post;
          })
        );
      }
      closeTextArea();
    } catch (error: unknown) {
      console.log("There was an error", error);
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const message = e.target.value;
    setTextArea((prevTextArea) => ({
      ...prevTextArea,
      message,
    }));
  }

  function closeTextArea() {
    setTextArea({ message: "", visible: false });
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        id="message"
        name="message"
        value={textArea.message}
        rows={2}
        className="block p-1 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-1"
        onChange={handleChange}
        required
      />
      <div className="flex gap-2">
        <button type="button" onClick={closeTextArea}>
          Cancel
        </button>
        <button type="submit">{textArea.postId ? "Update" : "Reply"}</button>
      </div>
    </form>
  );
};

export default ReplyForm;

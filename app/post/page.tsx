import Image from "next/image";
import { getSession } from "../options";
import { redirect } from "next/navigation";
import { postAction } from "../action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create Post Page",
};

const PostPage = async () => {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <form
      action={postAction}
      className="flex flex-col p-4 max-w-md mx-auto flex-grow"
    >
      <div className="flex place-items-center">
        <Image
          className="h-8 w-8 rounded-full mr-4"
          width={30}
          height={30}
          src={session?.user?.image ?? "/favicon.ico"}
          alt="profile-image"
        />
        <label
          htmlFor="message"
          className="text-white text-sm font-medium leading-6"
        >
          What do you want to write about?
        </label>
      </div>
      <div className="col-span-full">
        <div className="mt-2">
          <textarea
            id="message"
            name="message"
            rows={5}
            className="block p-1 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-1"
            required
          ></textarea>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
      >
        Post
      </button>
    </form>
  );
};

export default PostPage;

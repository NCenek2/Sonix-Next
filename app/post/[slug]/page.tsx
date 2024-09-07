import { editAction } from "@/app/action";
import SubmitButton from "@/app/components/SubmitButton";
import { getSession, prisma } from "@/app/options";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const PostEditPage = async ({ params }: { params: { slug: string } }) => {
  const session = await getSession();
  if (!session) redirect("/");

  const post = await prisma.post.findFirst({
    where: {
      id: params.slug,
    },
  });

  if (post?.userId !== session.user.id) redirect("/");
  const editActionWithPostId = editAction.bind(null, params.slug);

  return (
    <form
      action={editActionWithPostId}
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
            defaultValue={post.message}
          ></textarea>
        </div>
      </div>
      <div className="flex gap-1">
        <Link
          href="/posts"
          className="flex-grow text-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Cancel
        </Link>
        <SubmitButton name="Update" pendingName="Updating..." />
      </div>
    </form>
  );
};

export default PostEditPage;

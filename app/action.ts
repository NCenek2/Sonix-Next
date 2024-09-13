"use server";

import { redirect } from "next/navigation";
import { getSession, prisma } from "./options";

type PostAction = {
  message: string;
  userId: string;
};

export async function postAction(formData: FormData) {
  const session = await getSession();

  if (!session) redirect("/");

  const message = formData.get("message")?.toString();

  if (!message) return console.log("There is no message");

  let data: PostAction = {
    message,
    userId: session?.user.id,
  };

  await prisma.post.create({
    data,
  });

  return redirect("/profile");
}

export async function editAction(postId: string, formData: FormData) {
  const session = await getSession();

  if (!session) redirect("/");

  const message = formData.get("message")?.toString().trim();

  if (!message) return console.log("There is no message");
  if (!postId) return console.log("There is no postId");

  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  });

  if (!post) return console.log("Post to edit doesn't exist");

  if (post.userId !== session.user.id) return console.log("Unauthorized");

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      message,
    },
  });

  return redirect("/profile");
}

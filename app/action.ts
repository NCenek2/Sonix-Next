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

  return redirect("/posts");
}

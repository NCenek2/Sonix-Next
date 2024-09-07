"use server";

import { redirect } from "next/navigation";
import { getSession, prisma } from "./options";

export async function postAction(formData: FormData) {
  const session = await getSession();

  if (!session) redirect("/");

  const message = formData.get("message")?.toString();

  if (!message) return console.log("There is no message");

  await prisma.post.create({
    data: {
      message,
      userId: session?.user.id,
    },
  });

  return redirect("/profile");
}

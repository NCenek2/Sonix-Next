import { prisma } from "@/app/options";
import { NextResponse } from "next/server";

type DeletePost = {
  postId: string;
};

export async function DELETE(request: Request) {
  const data = await request.json();
  const { postId }: DeletePost = data;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json({
    status: 201,
  });
}

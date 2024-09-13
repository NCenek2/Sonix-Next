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

type ReplyPost = {
  message: string;
  userId: string;
  parentId?: string;
};

export async function POST(request: Request) {
  const data: ReplyPost = await request.json();
  const { message, userId, parentId } = data;

  if (!message || !userId || !parentId)
    return NextResponse.json({
      status: 400,
    });

  const parentPost = await prisma.post.findFirst({
    where: {
      id: parentId,
    },
  });

  if (!parentPost || parentPost.parentId !== null) {
    return NextResponse.json({
      status: 400,
    });
  }

  await prisma.post.update({
    where: {
      id: parentId,
    },
    data: {
      replyCount: parentPost.replyCount + 1,
    },
  });

  const post = await prisma.post.create({
    data: {
      message,
      userId,
      parentId,
    },
  });

  return NextResponse.json({
    status: 201,
    post,
  });
}

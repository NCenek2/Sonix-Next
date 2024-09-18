import { prisma } from "@/app/options";
import { NextResponse } from "next/server";

type DeletePost = {
  postId: string;
  parentId?: string;
};

export async function DELETE(request: Request) {
  const data = await request.json();
  const { postId, parentId }: DeletePost = data;

  // Deleting Children If Any
  await prisma.post.deleteMany({
    where: {
      parentId: {
        equals: postId,
      },
    },
  });

  // Updating Parent Count
  if (parentId) {
    const parentPost = await prisma.post.findFirst({
      where: {
        id: parentId,
      },
    });

    if (parentPost) {
      await prisma.post.update({
        where: {
          id: parentId,
        },
        data: {
          replyCount: parentPost.replyCount - 1,
        },
      });
    }
  }

  // Delting Post
  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json({
    status: 201,
  });
}

// Used for Both POST And Patch
type PostData = {
  message: string;
  userId: string;
  parentId?: string;
  postId?: string;
};

export async function POST(request: Request) {
  const data: PostData = await request.json();
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

  // Only create replies for parents that dont have a parent
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
    include: {
      likes: true,
      dislikes: true,
      user: {
        select: {
          image: true,
        },
      },
    },
  });

  return NextResponse.json({
    status: 201,
    post,
  });
}

export async function PATCH(request: Request) {
  const data: PostData = await request.json();
  const { message, userId, postId } = data;

  if (!message || !userId || !postId)
    return NextResponse.json({
      status: 400,
    });

  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      message,
    },
    include: {
      likes: true,
      dislikes: true,
      user: {
        select: {
          image: true,
        },
      },
    },
  });

  return NextResponse.json({
    status: 201,
    post,
  });
}

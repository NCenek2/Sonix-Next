import { ReactAction } from "@/app/components/ReactionButtons";
import { prisma } from "@/app/options";
import { PostDislike, PostLike } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type ReactResponse = {
  data: {
    status: number;
    liked?: PostLike;
    disliked?: PostDislike;
  };
};

export async function POST(request: NextRequest) {
  const data: ReactAction = await request.json();

  const { react, postId, userId, id } = data;

  const postWhere = {
    postId,
    userId,
  };

  let likedPost = await prisma.postLike.findFirst({
    where: postWhere,
  });
  let dislikedPost = await prisma.postDislike.findFirst({
    where: {
      userId,
      postId,
    },
  });

  try {
    if (react === "like") {
      if (dislikedPost) {
        await prisma.postDislike.delete({
          where: { id },
        });
      }

      if (!likedPost) {
        likedPost = await prisma.postLike.create({
          data: {
            postId,
            userId,
          },
        });
      }

      return NextResponse.json({
        status: 204,
        liked: likedPost,
        disliked: undefined,
      });
    } else {
      if (likedPost) {
        await prisma.postLike.delete({
          where: { id },
        });
      }

      if (!dislikedPost) {
        dislikedPost = await prisma.postDislike.create({
          data: {
            postId,
            userId,
          },
        });
      }

      return NextResponse.json({
        status: 204,
        liked: undefined,
        disliked: dislikedPost,
      });
    }
  } catch (error: unknown) {
    console.log("THERE WAS AN ERROR");
    return NextResponse.json({
      status: 400,
      error: "There was an error",
    });
  }
}

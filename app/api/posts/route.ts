import { getSession, prisma } from "../../options";
import { NextResponse } from "next/server";

// pages/api/posts.ts

export type PostWithRelations = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  message: string;
  replyCount: number;
  parentId: string | null;
  user: {
    image: string | null;
  };
  likes: {
    id: string;
    postId: string;
    userId: string;
  }[];
  dislikes: {
    id: string;
    postId: string;
    userId: string;
  }[];
};

type NotNull = {
  equals: string;
};

type IsNull = {
  isSet: false;
};

type whereType = {
  parentId: NotNull | IsNull;
  userId?: string;
};

export async function GET(request: Request) {
  const session = await getSession();

  if (!session)
    return NextResponse.json(
      { error: "Unauthorized" }, // More descriptive error message
      { status: 401 } // Use 401 Unauthorized for auth issues
    );

  const {
    user: { id },
  } = session;

  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const limit = url.searchParams.get("limit") ?? "10";
  const self = url.searchParams.get("self") !== null;
  const parentId = url.searchParams.get("parentId");

  let where: whereType = {
    parentId: {
      isSet: false,
    },
  };

  if (self) {
    where = {
      ...where,
      userId: id,
    };
  }

  if (parentId) {
    where = {
      ...where,
      parentId: {
        equals: parentId,
      },
    };
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  try {
    const posts = await prisma.post.findMany({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      include: {
        likes: true,
        dislikes: true,
        user: {
          select: {
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      where,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

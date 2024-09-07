import { NextResponse } from "next/server";

type SlugParameter = {
  params: { slug: string };
};

export async function GET(request: Request, { params }: SlugParameter) {
  try {
  } catch (e: unknown) {}

  return NextResponse.json({});
}

export async function PATCH(request: Request) {}

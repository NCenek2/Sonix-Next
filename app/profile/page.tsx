"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { PostWithRelations } from "../api/posts/route";
import Link from "next/link";
import { redirect } from "next/navigation";
import Post from "../components/Post";

const ProfilePage = () => {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // For pagination

  const { data: session, status } = useSession();
  console.log("session ", session);

  const fetchPosts = async (pageNumber: number) => {
    try {
      const response = await axios(`/api/posts?page=${pageNumber}&self`);
      const newPosts = response.data;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(newPosts.length >= 10); // Determine if there are more posts to load
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page); // Fetch initial posts
  }, [page]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    let currentlyLoading = true;
    setIsLoading((prevIsLoading) => {
      currentlyLoading = prevIsLoading;
      return prevIsLoading;
    });

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      hasMore &&
      !currentlyLoading
    ) {
      // Load more posts when near the bottom
      setIsLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (status === "loading") return <h1>Loading...</h1>;
  if (status === "unauthenticated" || !session) return redirect("/");

  return (
    <div className="flex flex-col p-2 gap-2 w-full md:w-1/2 m-auto">
      <div className="flex justify-center">
        <Link
          href={"/post"}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Post
        </Link>
      </div>
      {posts.map((post) => (
        <Post key={post.id} {...post} session={session} setPosts={setPosts} />
      ))}
      {isLoading && <h2 className="text-white">Loading Posts...</h2>}
    </div>
  );
};

export default ProfilePage;

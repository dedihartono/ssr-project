import React from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

// This is a Server Component by default
export default async function Home() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    next: {
      revalidate: 10,
    },
    headers: {
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const posts: Post[] = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-2xl font-bold mb-8">Posts</h1>
      <div className="flex flex-col gap-8 w-full max-w-2xl">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border border-gray-300 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2">{post.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

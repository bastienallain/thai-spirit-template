import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

// Create a PostCard component to display each post as a card
function PostCard(post: Post) {
  const Content = getMDXComponent(post.body.code);

  return (
    <Link
      href={post.url}
      className="col-span-12 sm:col-span-4 h-[300px] mb-8 relative block"
    >
      <div className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">
          {post.category || "General"}
        </p>
        <h2 className="text-white font-medium text-large">{post.title}</h2>
      </div>
      <img
        alt={post.title}
        className="z-0 w-full h-full object-cover"
        src={post.coverImage || "/default-cover.jpg"}
      />
      <time dateTime={post.date} className="block mb-2 text-xs text-gray-600">
        {format(parseISO(post.date), "LLLL d, yyyy")}
      </time>
      <div className="text-sm">
        <Content />
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8 py-8 mx-auto">
      <h1 className="col-span-12 mb-8 text-3xl font-bold text-center">
        Next.js Example
      </h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
}

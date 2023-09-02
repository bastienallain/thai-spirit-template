"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { compareDesc } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import Image from "next/image";
import { Card, CardHeader, CardFooter } from "@nextui-org/react";

interface PostCardProps {
  index: number;
  post: Post;
  onLanguageChange: (lang: string) => void;
}

function PostCard({ index, post, onLanguageChange }: PostCardProps) {
  useEffect(() => {
    if (post.language) {
      onLanguageChange(post.language);
    }
  }, [post, onLanguageChange]);

  const isLarge = index % 4 === 0 || index % 4 === 3;

  return (
    <Link
      href={post.url}
      style={{
        gridColumn: isLarge ? "span 8 / auto" : "span 4 / auto",
        marginBottom: "8px",
      }}
    >
      <Card isFooterBlurred className="w-full h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{post.category}</p>
          <h2 className="font-medium text-xl">{post.title}</h2>
        </CardHeader>
        <Image
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src={(post as any).thumbnailImage}
          height={1200}
          width={900}
        />
        <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
          <div className="flex flex-grow gap-2 items-center">
            <Image
              alt="Breathing app icon"
              className="rounded-full w-10 h-11 bg-black"
              src="https://res.cloudinary.com/vivacoda/image/upload/v1676397788/elite-designer-wp/2033127800_1_1_1.jpg"
              height={1200}
              width={900}
            />
            <div className="flex flex-col">
              <p className="text-tiny">{post.metaDescription}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
export const generateStaticPaths = async () => {
  const paths = allPosts.map((post) => {
    return {
      params: { slug: post._raw.flattenedPath.split("/") },
    };
  });
  return {
    paths,
    fallback: false,
  };
};
export default function BlogPage() {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const filteredPosts = allPosts
    .filter((post) =>
      process.env.NODE_ENV === "production" ? !post.draft : true
    )
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <>
      <Head>
        <title>
          {filteredPosts.length > 0
            ? filteredPosts[0].metaTitle
            : "Titre par défaut"}
        </title>
        <meta
          name="description"
          content={
            filteredPosts.length > 0
              ? filteredPosts[0].metaDescription
              : "Description par défaut"
          }
        />
        <script type="application/ld+json">
          {JSON.stringify(
            filteredPosts.length > 0 ? filteredPosts[0].structuredData : {}
          )}
        </script>
      </Head>
      <div className="max-w-[1600px] gap-2 grid grid-cols-12 grid-rows-2 px-8 py-8 mx-auto">
        <h1 className="col-span-12 mb-8 text-3xl font-bold text-center">
          Next.js Example
        </h1>
        {filteredPosts.map((post, idx) => (
          <PostCard
            key={idx}
            index={idx}
            post={post}
            onLanguageChange={(lang: string) => setCurrentLanguage(lang)}
          />
        ))}
      </div>
    </>
  );
}

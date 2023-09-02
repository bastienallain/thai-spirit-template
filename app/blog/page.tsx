"use client";
import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";

// Create a PostCard component to display each post as a card
function PostCard({ index, post }: { index: number; post: Post }) {
  const Content = getMDXComponent(post.body.code);
  const cardClass =
    index === 0 // Si c'est la première carte
      ? "md:w-2/3 w-full   h-[300px]" // 2/3 de l'espace sur desktop
      : index === 1 // Si c'est la deuxième carte
      ? "md:w-1/3 w-full h-[300px]" // 1/3 de l'espace sur desktop
      : "md:w-1/3 w-full h-[300px]";
  return (
    <Link href={post.url} className="col-span-12 mb-8 relative block">
      <Card isFooterBlurred className={cardClass}>
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <p className="text-tiny text-white/60 uppercase font-bold">
            Your day your way
          </p>
          <h4 className="text-white/90 font-medium text-xl">
            Your checklist for better sleep
          </h4>
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
              <p className="text-tiny text-white/60">Breathing App</p>
              <p className="text-tiny text-white/60">
                <Content />
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
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
        <PostCard key={idx} index={idx} post={post} />
      ))}
    </div>
  );
}

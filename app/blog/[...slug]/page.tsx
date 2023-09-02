import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";

interface ParamsType {
  slug: string[];
}

export const generateStaticParams = async () => {
  return allPosts.map((post) => ({
    params: { slug: post._raw.flattenedPath.split("/") },
  }));
};

export const generateMetadata = ({ params }: { params: ParamsType }) => {
  const slugAsString = params.slug.join("/");
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === slugAsString
  );
  return post
    ? { title: post.title, description: post.metaDescription }
    : { title: "Post Not Found", description: "Description not found" };
};

const PostLayout = ({ params }: { params: ParamsType }) => {
  const slugAsString = params.slug.join("/");
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === slugAsString
  );

  if (!post) {
    return <div>Post not found</div>;
  }
  const Content = getMDXComponent(post.body.code);

  return (
    <article className=" mx-auto">
      <div className="mb-8 text-center">
        <Image
          alt={post.title}
          className="z-0 w-full h-[45vh] object-contain"
          src={post.coverImage || "/test.jpeg"}
          height={1200}
          width={900}
        />
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1>{post.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default PostLayout;

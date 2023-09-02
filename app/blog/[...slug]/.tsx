import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";

interface ParamsType {
  slug: string[];
}
interface Props {
  params?: ParamsType;
  metadata?: {
    title: string;
    description: string;
  };
}
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPosts.map((post) => ({
    params: { slug: post._raw.flattenedPath.split("/") },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params || !Array.isArray(params.slug)) {
    return { props: {} };
  }
  const slugAsString = params.slug.join("/");
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === slugAsString
  );
  return {
    props: {
      params: { slug: slugAsString },
      metadata: post
        ? { title: post.title, description: post.metaDescription }
        : null,
    },
  };
};

const PostLayout: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  params = { slug: [] },
  metadata,
}) => {
  if (!params || !Array.isArray(params.slug)) {
    return <div>Post not found</div>;
  }

  const slugAsString = params.slug.join("/");
  const post = allPosts.find(
    (post) => post._raw.flattenedPath === slugAsString
  );

  if (!post) {
    return <div>Post not found</div>;
  }

  const Content = getMDXComponent(post.body.code);
  return (
    <article className="mx-auto">
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

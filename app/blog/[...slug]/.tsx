import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";

interface ParamsType {
  slug: string[];
}

interface Metadata {
  title: string;
  description: string;
}

interface Props {
  params?: ParamsType;
  metadata?: Metadata | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPosts.map((post) => ({
    params: { slug: post._raw.flattenedPath.split("/") },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  return new Promise((resolve, reject) => {
    try {
      if (!params || !Array.isArray(params.slug)) {
        resolve({ props: {} });
        return;
      }
      const slugAsString = params.slug.join("/");
      const post = allPosts.find(
        (post) => post._raw.flattenedPath === slugAsString
      );
      resolve({
        props: {
          params: { slug: params.slug },
          metadata: post
            ? { title: post.title, description: post.metaDescription }
            : null,
        },
      });
    } catch (error) {
      console.error("Error in getStaticProps:", error);
      reject({ props: {} });
    }
  });
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
    <>
      <Head>
        <title>{metadata?.title || "Default Title"}</title>
        <meta
          name="description"
          content={metadata?.description || "Default Description"}
        />
      </Head>
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
    </>
  );
};

export default PostLayout;

import { defineDocumentType, makeSource } from 'contentlayer/source-files'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    coverImage: { // Ajout de ce champ
      type: 'string',
      description: 'The cover image of the post',
      required: true,
    },
    thumbnailImage:{ // Ajout de ce champ
        type: 'string',
        description: 'The cover image of the post',
        required: true,
      },
    category: { // Ajout de ce champ
      type: 'string',
      description: 'The category of the post',
      required: true,
    },
    metaTitle: {
        type: 'string',
        description: 'Le titre méta SEO du post',
        required: true,
      },
      metaDescription: {
        type: 'string',
        description: 'La description méta SEO du post',
        required: true,
      },
      draft: {
        type: 'boolean',
        description: 'Si le post est un brouillon ou non',
        required: true,
      },
      language: {
        type: 'string',
        description: 'La langue du post',
        required: true,
      },
      catMenu: {
        type: 'string',
        description: 'The menu category of the post',
        required: false, 
      },
      catCity: {
        type: 'string',
        description: 'The city category of the post',
        required: false, 
      },
    
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace('.mdx', '')}`,
    },
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.date,
        description: doc.metaDescription,
        image: doc.coverImage,
        url: `/blog/${doc._raw.flattenedPath.replace('.mdx', '')}`,
      }),
    },
  },
}))

export default makeSource({
  contentDirPath: 'blog',
  documentTypes: [Post],
})

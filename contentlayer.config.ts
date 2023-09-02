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
      required: false,
    },
    thumbnailImage:{ // Ajout de ce champ
        type: 'string',
        description: 'The cover image of the post',
        required: false,
      },
    category: { // Ajout de ce champ
      type: 'string',
      description: 'The category of the post',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/blog/${doc._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'blog',
  documentTypes: [Post],
})

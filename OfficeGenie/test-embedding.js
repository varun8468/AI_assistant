import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: 'Xenova/all-MiniLM-L6-v2',
});

const queryRes = await embeddings.embedQuery("What is our leave policy?");
console.log('Query vector:', queryRes.length);

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function embedAndStoreDocs(relativePath) {
  const filePath = path.join(__dirname, relativePath);
  const rawText = fs.readFileSync(filePath, "utf-8");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const docs = await splitter.createDocuments([rawText])
  console.log(docs);

  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: 'Xenova/all-MiniLM-L6-v2',
  });

  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
  })

  console.log('✅ Documents embedded and stored.');

}

embedAndStoreDocs("../data/hr-policy.txt");

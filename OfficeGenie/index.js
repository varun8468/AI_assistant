import { Ollama } from "@langchain/ollama";
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function askQuestion(question) {
    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const vectorStore = new SupabaseVectorStore(new HuggingFaceTransformersEmbeddings({
        model: 'Xenova/all-MiniLM-L6-v2',
    }), {
        client,
        tableName: 'documents',
        queryName: 'match_hr_docs',
    });

    const results = await vectorStore.similaritySearch(question, 4);
    const context = results.map(doc => doc.pageContent).join('\n');

    const model = new Ollama({
        baseUrl: 'http://localhost:11434',
        model: 'mistral',
    });

    // 🛠️ FIX: Combine everything into a single prompt string
    const prompt = `You are a helpful HR assistant. Answer the following question based on the context below.

Context:
${context}

Question:
${question}

Answer:`;

    const res = await model.call(prompt);

    return res;
}


console.log(await askQuestion("what is notice period?"))
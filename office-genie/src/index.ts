// server.ts
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { LLMFactory } from "./services/llm/LLMFactory";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

app.post("/ask", async (req, res) => {
  try {
    const { isOnline, llm, question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const vectorStore = new SupabaseVectorStore(
      new HuggingFaceTransformersEmbeddings({
        model: "Xenova/all-MiniLM-L6-v2",
      }),
      {
        client,
        tableName: "documents",
        queryName: "match_hr_docs",
      }
    );

    const results = await vectorStore.similaritySearch(question, 4);
    const context = results.map((doc) => doc.pageContent).join("\n");
    console.log(context)

    const prompt = `You are a helpful HR assistant. Answer the following question based on the context below.

Context:
${context}

Question:
${question}

Answer:`;

    console.log("starting llm..")
    const llmStrategy = LLMFactory.create(isOnline, llm);
    console.log(llmStrategy, "llm strategy")
    const answer = await llmStrategy.generate(prompt);

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`AI assistant server running on port ${port}`);
});

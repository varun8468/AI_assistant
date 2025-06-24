import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFParser from "pdf2json";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Helper function to parse PDF using pdf2json
function parsePDFWithPdf2json(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", errData => {
      reject(new Error(`PDF parsing error: ${errData.parserError}`));
    });
    
    pdfParser.on("pdfParser_dataReady", pdfData => {
      try {
        // Extract text from all pages
        let fullText = '';
        pdfData.Pages.forEach(page => {
          page.Texts.forEach(textItem => {
            textItem.R.forEach(textRun => {
              fullText += decodeURIComponent(textRun.T) + ' ';
            });
          });
          fullText += '\n'; // Add newline between pages
        });
        
        resolve({
          text: fullText.trim(),
          numPages: pdfData.Pages.length,
          title: pdfData.Meta?.Title || null
        });
      } catch (error) {
        reject(error);
      }
    });
    
    pdfParser.loadPDF(filePath);
  });
}

let pdfData;

export async function embedAndStoreDocs(relativePath) {
  const filePath = path.join(__dirname, relativePath);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  console.log(`📂 Reading PDF from: ${filePath}`);
  
  try {
    // Parse PDF to extract text
    pdfData = await parsePDFWithPdf2json(filePath);
    console.log(pdfData, "pdf data")
  } catch (error) {
    console.error(`❌ Error processing PDF: ${error.message}`);
    throw error;
  }
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  
  const docs = await splitter.createDocuments([pdfData.text], [
    { 
      source: relativePath,
      pages: pdfData.numPages,
      title: pdfData.title || path.basename(filePath, '.pdf')
    }
  ]);

  console.log(docs, "docs")
  
  console.log(`📚 Split into ${docs.length} chunks`);

  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: 'Xenova/all-MiniLM-L6-v2',
  });

  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_hr_docs'
  });

  console.log('✅ Documents embedded and stored.');
}

embedAndStoreDocs("../data/Flexible Benefits Policy_V1.pdf");
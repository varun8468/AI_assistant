# HR Assistant – AI-Powered Policy and SOP Discovery

This project is an AI-powered HR Assistant designed to help employees and HR teams quickly discover company policies, SOPs, and related documents. It leverages modern AI models (Mistral, Cohere, and local LLMs via Ollama) and vector search for efficient document retrieval and Q&A.

---

## Project Structure

```
ai-assistant/      # Frontend (React + Vite)
office-genie/      # Backend (Node.js + Express + LangChain)
```

---

## Features

- **Semantic Search:** Retrieve relevant policy/SOP documents using vector embeddings.
- **AI Q&A:** Ask questions in natural language and get answers based on company documents.
- **Multiple LLM Support:** Switch between online (Mistral, Cohere) and offline (Ollama) models.
- **Chat History:** Maintains conversation history using MongoDB.
- **Modern UI:** Clean, responsive React interface with model and mode selection.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB Atlas (or local MongoDB)
- Supabase account (for vector storage)
- Ollama for local LLMs

---

### 1. Backend Setup (`office-genie`)

1. **Install dependencies:**
   ```sh
   cd office-genie
   npm install
   ```
		
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `MONGODB_ATLAS_URI`
     - `COHERE_API_KEY` (for Cohere)
     - `MISTRAL_API_KEY` (for Mistral)
   - Example:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     MONGODB_ATLAS_URI=your_mongodb_connection_string
     COHERE_API_KEY=your_cohere_api_key
     MISTRAL_API_KEY=your_mistral_api_key
     ```

3. **Embed documents (run once or when new documents are added):**
  
   npm run embed


4. **Start the backend server:**
   ✅ npm run dev
   The server runs on `http://localhost:3000`.

---

### 2. Frontend Setup (`ai-assistant`)

1. **Install dependencies:**
   cd ai-assistant
   npm install

2. **Start the development server:**
   ✅ npm run dev
   The app runs on `http://localhost:5173` (default Vite port).

---

## Usage

- Open the frontend in your browser.
- Select connection mode (Online/Offline) and model (Mistral/Cohere/Deepseel/Llama).
- Enter your HR-related question in the prompt area.
- The assistant will respond based on your company’s policy documents.

---

## Architecture Overview

- **Frontend:** React app for user interaction, model/mode selection, and chat UI.
- **Backend:** Node.js/Express server using LangChain for LLM orchestration, Supabase for vector search, and MongoDB for chat history.
- **Document Embedding:** All PDF documents in `office-genie/data/` are embedded and indexed for semantic search.

---

## Adding New Documents

1. Place new PDF files in `office-genie/data/`.
2. Re-run the embedding script:
   ```sh
   node dist/scripts/embedAllDocs.js
   ```

---

## Supported AI Models

- **Online:** Mistral, Cohere (API keys required)
- **Offline:** Ollama (local LLMs, e.g., Llama3)

---

## Acknowledgements
- [LangChain](https://js.langchain.com/)
- [Supabase](https://supabase.com/)
- [Ollama](https://ollama.com/)
- [Cohere](https://cohere.com/)
- [Mistral AI](https://mistral.ai/)
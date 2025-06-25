import { Cohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import { LLMStrategy } from "./LLMStrategy";

export class OnlineLLM implements LLMStrategy {
  private model: any;

  constructor(llmName: string = "gpt-3.5-turbo") {
    const llmNameLower = llmName.toLowerCase();

    if (llmNameLower.startsWith("command")) {
      this.model = new Cohere({
        model: llmName,
        temperature: 0.3,
        apiKey: process.env.COHERE_API_KEY,
      });
    } else if (llmNameLower.startsWith("mistral")) {
      this.model = new ChatMistralAI({
        modelName: llmName,
        temperature: 0.3,
        apiKey: process.env.MISTRAL_API_KEY, 
      });
    } else {
      throw new Error(`Unsupported online LLM model: ${llmName}`);
    }
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.model.call([["user", prompt]]);
    return response.content ?? response;
  }
}

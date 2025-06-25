// llm/OnlineLLM.ts
import { ChatOpenAI } from "@langchain/openai";
import { LLMStrategy } from "./LLMStrategy";

export class OnlineLLM implements LLMStrategy {
  private model: ChatOpenAI;

  constructor(llm: string = "gpt-3.5-turbo") {
    this.model = new ChatOpenAI({
      modelName: llm,
      temperature: 0.3,
    });
  }

  async generate(prompt: string): Promise<string> {
    const response = await this.model.call([["user", prompt]]);
    return response.content;
  }
}

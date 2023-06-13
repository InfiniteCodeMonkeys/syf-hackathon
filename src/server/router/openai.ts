import { z } from "zod";
import { publicProcedure, router } from "../trpcConfig";
import { StructuredOutputParser } from "langchain/output_parsers";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

export const openAIRouter = router({
  getResults: publicProcedure
    .input(z.object({ thing: z.string(), show: z.string() }))
    .mutation(async ({ input }) => {
      // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
      const parser = StructuredOutputParser.fromZodSchema(
        z.array(
          z.object({
            item: z.string().describe("name of the item"),
          })
        )
      );
      const formatInstructions = parser.getFormatInstructions();

      const prompt = new PromptTemplate({
        template:
          "Answer the users question as best as possible.\n{format_instructions}\n{question}",
        inputVariables: ["question"],
        partialVariables: {
          format_instructions: formatInstructions,
        },
      });

      const model = new OpenAI({ maxTokens: 2800 });

      const questionInput = await prompt.format({
        question: `I am a 50 year old woman in Chicago and I like to watch the show "${input.show}". I am looking to buy new ${input.thing}. Please list six ${input.thing} from the show "${input.show}" with links to stores where I can buy it, in JSON array of objects format, just the raw JSON data, no text response. There should only be one key in each object: item. The item should be very descriptive. Do not add any text above or below your response.`,
      });
      const response = await model.call(questionInput);

      const startOfArray = response.indexOf("[");
      const endOfArray = response.lastIndexOf("]");

      const array = response.slice(startOfArray, endOfArray + 1);

      console.log(array);

      const items = JSON.parse(array);

      const formattedItemsArray: any[] = [];

      try {
        const getResponses = async () => {
          for (const item of items) {
            const response = await fetch(
              `https://serpapi.com/search?tbm=shop&engine=google&gl=us&hl=en&api_key=${process.env.SERPAPI_API_KEY}&q=${item.item}`
            );

            console.log(response);
            const data = await response.json();

            for (let i = 0; i <= 5; i++) {
              formattedItemsArray.push(data.shopping_results[i]);
            }
          }

          console.log("formattedItemsArray", formattedItemsArray);
        };

        await getResponses();
        return formattedItemsArray;
      } catch (error) {
        console.log(error);
        return error;
      }
    }),
});

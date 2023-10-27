import { z } from "zod";
import { publicProcedure, router } from "../trpcConfig";
import { Configuration, OpenAIApi } from "openai";

export const openAIRouter = router({
  getResults: publicProcedure
    .input(z.object({ thing: z.string(), show: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const configuration = new Configuration({
          organization: "org-2RXUwEw2a3Hf0KBwkJIRbzFm",
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "The following is a conversation with an AI assistant. The assistant is very knowledgeable about the topic of the conversation. The assistant is helpful and very friendly.",
            },
            {
              role: "user",
              content: `I am a 50 year old woman in Chicago and I like to watch the show "${input.show}". I am looking to buy new ${input.thing}. Please list six ${input.thing} from the show "${input.show}" with links to stores where I can buy it, in JSON array of objects format, just the raw JSON data, no text response. There should only be one key in each object: item. The item should be very descriptive. Do not add any text above or below your response.`,
            },
          ],
        });

        console.log(response);

        const items = await JSON.parse(
          response.data.choices[0]?.message?.content as string
        );

        const formattedItemsArray: any[] = [];

        const getResponses = async () => {
          for (const item of items) {
            const response = await fetch(
              `https://serpapi.com/search?tbm=shop&engine=google&gl=us&hl=en&api_key=${process.env.SERPAPI_API_KEY}&q=${item.item}`
            );

            console.log(response);
            const data = await response.json();

            for (let j = 0; j <= 5; j++) {
              formattedItemsArray.push(data.shopping_results[j]);
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

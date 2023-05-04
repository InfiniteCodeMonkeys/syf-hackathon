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
              content: `I am a 50 year old woman in Chicago and I like to watch ${input.show}. I am looking to buy new ${input.thing}. Please list ten ${input.thing} from the show ${input.show} as a shopping query.`,
            },
          ],
        });
        console.log(response.data.choices[0]);

        return response.data.choices[0];
      } catch (error) {
        console.log(error);
        return error;
      }
    }),
});

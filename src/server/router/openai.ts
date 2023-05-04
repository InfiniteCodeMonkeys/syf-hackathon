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
              content: `Please create a syllabus for an undergraduate course called '${input.title}' with a description, learning objectives, and for all 8 weeks of the course, please recommend readings and videos with links to amazon for the books and links to youtube for the videos.`,
            },
          ],
        });
        console.log(response.data.choices);

        const secondResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "The following is a conversation with an AI assistant. The assistant is very knowledgeable about the topic of the conversation. The assistant is helpful and very friendly.",
            },
            {
              role: "user",
              content: `Please put the following into a JSON object: ${response.data.choices[0]?.message?.content}`,
            },
          ],
        });
        console.log(secondResponse.data?.choices[0]?.message?.content);

        const object = JSON.parse(
          secondResponse.data?.choices[0]?.message?.content as string
        );

        console.log("object", object);

        return secondResponse.data.choices;
      } catch (error) {
        console.log(error);
        return error;
      }
    }),
});

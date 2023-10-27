import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const getResults = async (thing: string, show: string) => {
  try {
    const configuration = new Configuration({
      organization: "org-2RXUwEw2a3Hf0KBwkJIRbzFm",
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "The following is a conversation with an AI assistant. The assistant is very knowledgeable about the topic of the conversation. The assistant is helpful and very friendly.",
        },
        {
          role: "user",
          content: `I am a big fan of the popular show: "${show}". I am looking to buy new ${thing}. Please list six search queries of ${thing} from the show "${show}", in JSON array of objects format, just the raw JSON data, no text response. There should only be one key in each object: item. The item should be very descriptive. Do not add any text above or below your response.`,
        },
      ],
    });

    console.log(response.data.choices[0]?.message?.content);

    const items = await JSON.parse(
      response.data.choices[0]?.message?.content as string
    );

    console.log("items", items);

    const formattedItemsArray: any[] = [];

    const getResponses = async () => {
      for (const item of items) {
        const response = await fetch(
          `https://serpapi.com/search?tbm=shop&engine=google&gl=us&hl=en&api_key=${process.env.SERPAPI_API_KEY}&q=${item.item}`
        );

        const data = await response.json();
        console.log("data", data);

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
    return { error };
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { thing, show } = JSON.parse(req.body);
  const results = await getResults(thing, show);

  if (!results) {
    return res.status(404).json({ message: "No results found" });
  }

  return res.status(200).json(results);
}

export default handler;

export const config = {
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 300,
};

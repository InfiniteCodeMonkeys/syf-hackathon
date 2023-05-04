import { router } from "../trpcConfig";
import { openAIRouter } from "./openai";

export const appRouter = router({
  openAI: openAIRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

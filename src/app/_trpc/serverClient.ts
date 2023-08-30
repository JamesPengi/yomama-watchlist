import { httpBatchLink } from "@trpc/client";
import { appRouter } from "~/server/api/root";
import { getBaseUrl } from "./shared";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

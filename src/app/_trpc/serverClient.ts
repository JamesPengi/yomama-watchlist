import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter, appRouter } from "~/server/api/";
import { getBaseUrl } from "./shared";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});

import { z } from "zod";

export const createEventSchema = {
  body: z
    .object({
      sessionId: z.string().min(1, "sessionId is required"),
      type: z.enum(["page_view", "click"], {
        message: "type must be page_view or click",
      }),
      url: z.string().min(1, "url is required"),
      timestamp: z.coerce.date({
        message: "timestamp must be a valid date",
      }),
      x: z.number().optional(),
      y: z.number().optional(),
    })
    .refine(
      (data) => {
        if (data.type === "click") {
          return data.x !== undefined && data.y !== undefined;
        }
        return true;
      },
      {
        message: "x and y coordinates are required for click events",
        path: ["x"],
      }
    ),
};

export const getHeatmapSchema = {
  query: z.object({
    url: z.string().min(1, "url query parameter is required"),
    sessionId: z.string().optional(),
  }),
};

export const getSessionParamsSchema = {
  params: z.object({
    sessionId: z.string().min(1, "sessionId parameter is required"),
  }),
};

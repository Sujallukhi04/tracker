import { Request, Response } from "express";
import Event from "../models/Event";

export const getHeatmapData = async (req: Request, res: Response) => {
  const { url, sessionId } = req.query;

  const query: any = {
    type: "click",
    url: url as string,
  };

  if (sessionId) {
    query.sessionId = sessionId as string;
  }

  const clicks = await Event.find(query).select("x y -_id");
  res.json(clicks);
};

export const getTrackedUrls = async (_req: Request, res: Response) => {
  const urls = await Event.distinct("url");
  res.json(urls);
};




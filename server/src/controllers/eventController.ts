import { Request, Response } from "express";
import Event from "../models/Event";

export const createEvent = async (req: Request, res: Response) => {
  const { sessionId, type, url, timestamp, x, y } = req.body;
  const event = await Event.create({ sessionId, type, url, timestamp, x, y });
  res.status(201).json(event);
};


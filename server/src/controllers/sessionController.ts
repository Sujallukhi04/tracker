import { Request, Response } from "express";
import Event from "../models/Event";

export const getAllSessions = async (_req: Request, res: Response) => {
  const sessions = await Event.aggregate([
    {
      $group: {
        _id: "$sessionId",
        eventCount: { $sum: 1 },
        lastSeen: { $max: "$timestamp" },
        firstSeen: { $min: "$timestamp" },
      },
    },
    { $sort: { lastSeen: -1 } },
  ]);
  res.json(sessions);
};

export const getSessionById = async (req: Request, res: Response) => {
  const events = await Event.find({ sessionId: req.params.sessionId }).sort({
    timestamp: -1,
  });
  res.json(events);
};


import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  sessionId: string;
  type: "page_view" | "click";
  url: string;
  timestamp: Date;
  x?: number;
  y?: number;
}

const EventSchema = new Schema<IEvent>({
  sessionId: { type: String, required: true, index: true },
  type: { type: String, enum: ["page_view", "click"], required: true },
  url: { type: String, required: true },
  timestamp: { type: Date, required: true },
  x: { type: Number },
  y: { type: Number },
});

export default mongoose.model<IEvent>("Event", EventSchema);

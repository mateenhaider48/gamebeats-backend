import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  plan: "daily" | "weekly" | "monthly" ;
  status: "active" | "inactive" | "cancel";
  expiresAt?: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancel"],
      default: "active",
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ user: 1, status: 1 });

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

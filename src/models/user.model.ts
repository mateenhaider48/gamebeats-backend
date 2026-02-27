import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
   email: string;
   username: string;
   phoneNumber: string;
   password: string;
   countryName?: string;
   isSubscriber?: boolean;
   subscriptionId?: mongoose.Types.ObjectId | null;
   fullName?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },  
    password :{
      type: String,
      required: true,
    },
    countryName:{
      type:String,
    },
    isSubscriber: {
      type: Boolean,
      default: false,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    fullName:{
      type:String,
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
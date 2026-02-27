import mongoose from "mongoose";


export const isValidObjectId = (id: any): boolean => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

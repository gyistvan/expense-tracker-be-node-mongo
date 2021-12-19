import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const incomeSchema = new Schema({
  amount: {
    type: Number,
    required: "Amount is required",
  },
  whose: {
    type: String,
    required: "Whose is required",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  spentAt: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
  },
  groupId: {
    type: String,
  },
});

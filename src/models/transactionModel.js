import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: "Amount is required",
  },
  type: {
    type: String,
    required: "Specify type",
  },
  comment: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  usedFor: {
    type: String,
  },
  spentAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  groupId: {
    type: String,
    required: "GroupId is required",
  },
});

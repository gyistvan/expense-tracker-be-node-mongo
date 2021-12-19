import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const savingSchema = new Schema({
  amount: {
    type: Number,
    required: "Amount is required",
  },
  appliedMonth: {
    type: Date,
    required: "Applied month is required",
  },
  groupId: {
    type: String,
  },
});

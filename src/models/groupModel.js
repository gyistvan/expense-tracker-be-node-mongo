import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const groupSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: {
    type: Array,
    default: {},
  },
  invited: {
    type: Object,
    default: {},
  },
  ownerId: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
  },
});

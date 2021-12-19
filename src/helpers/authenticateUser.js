import { userSchema } from "../models/userModel";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JSON_SECRET } from "../..";

const User = mongoose.model("User", userSchema);

export const verifyToken = async (token, secretkey) => {
  try {
    const data = jwt.verify(token, secretkey);
    return data;
  } catch (err) {
    return err;
  }
};

export const getUser = async (token) => {
  try {
    const userFound = false;
    if (token) {
      let data = await verifyToken(token, JSON_SECRET);
      let user = await findUserInDb(data);
      if (user) {
        return user;
      } else {
        throw new Error("UserNotFound");
      }
    } else return userFound;
  } catch (error) {
    console.log(error);
  }
};

export const findUserInDb = (jwt_payload) => {
  try {
    const query = User.findOne({ _id: jwt_payload._id });
    const returnUser = query.exec();
    return returnUser;
  } catch (err) {
    console.log(err);
  }
};

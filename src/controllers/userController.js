import { userSchema } from "../models/userModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JSON_SECRET } from "../../index.js";
import { getUser } from "../helpers/authenticateUser.js";

const User = mongoose.model("User", userSchema);

export const register = (req, res) => {
  var newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function (err, user) {
    if (err) {
      if (err.code === 11000) {
        return res.status(400).send({
          message: "SHARED_COMPONENTS.NOTIFICATIONS.EMAIL_ALREADY_IN_USE",
        });
      } else {
        return res.status(400).send(err);
      }
    } else {
      user.hash_password = undefined;
      return res.json({
        user,
        error: false,
        message: "SHARED_COMPONENTS.NOTIFICATIONS.REGISTRATION_SUCCESS",
      });
    }
  });
};

export const login = (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err) throw err;
      if (!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({
          error: true,
          message: "SHARED_COMPONENTS.NOTIFICATIONS.LOGIN_FAILED",
        });
      }
      return res.json({
        token: jwt.sign(
          {
            email: user.email,
            name: user.name,
            _id: user._id,
          },
          JSON_SECRET
        ),
      });
    }
  );
};

export const updateProfile = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    User.findOneAndUpdate(
      { email: userData.email },
      { name: req.body.name, email: req.body.email, groupId: req.body.groupId },
      {
        new: true,
        useFindAndModify: false,
      },
      (err, user) => {
        if (err) throw err;
        return res.json(user);
      }
    );
  });
};

export const profile = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    res.send({
      name: userData.name,
      email: userData.email,
      groupId: userData.groupId,
      _id: userData._id,
      pendingInvites: userData.pendingInvites,
    });
  });
};

export const logout = (req, res) => {
  res.json("successful logout");
};

export const updatePassword = (req, res) => {
  if (req.body.newPassword === req.body.newPassword2) {
    const userPromise = getUser(req.headers.authorization);
    userPromise.then((userData) => {
      User.findOne(
        {
          email: userData.email,
        },
        (err, user) => {
          if (err) throw err;
          if (!user || !user.comparePassword(req.body.oldPassword)) {
            return res.status(400).json({
              message: "SHARED_COMPONENTS.NOTIFICATIONS.OLD_PASSWORD_INVALID",
            });
          }
          User.findOneAndUpdate(
            {
              email: userData.email,
            },
            { hash_password: bcrypt.hashSync(req.body.newPassword, 10) },
            {
              new: true,
              useFindAndModify: false,
            },
            (err, user) => {
              if (err) throw err;
              return res.json("Password successfully changed");
            }
          );
        }
      );
    });
  } else {
    res.json("new passwords doesn't match");
  }
};

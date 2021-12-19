import { userSchema } from "../models/userModel";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JSON_SECRET } from "../..";
import { getUser, verifyToken } from "../helpers/authenticateUser";

const User = mongoose.model("User", userSchema);

export const register = (req, res) => {
  var newUser = new User(req.body);
  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  newUser.save(function (err, user) {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
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
          message: "Authentication failed. Invalid user or password.",
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

export const updateProfile = (req,res) => {
    const userPromise = getUser(req.headers.authorization);
    userPromise.then((userData) => {
        User.findOneAndUpdate(
            {email: userData.email},
            {name: req.body.name, email: req.body.email, groupId: req.body.groupId},
            {
                new: true,
                useFindAndModify: false,
            },
            (err, user) => {
              if (err) throw err;
              return res.json(user);
            }
        )
    })
}

export const profile = (req, res, next) => {
    const userPromise = getUser(req.headers.authorization);
    userPromise.then((userData) => {
        res.send({name: userData.name, email: userData.email, groupId: userData.groupId});
        next();
    })
};

export const logout = (req, res) => {
    res.json("successful logout");
};

export const updatePassword = (req, res) => {
    if (req.body.newPassword === req.body.newPassword2){
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
                      message: "Bad request, old password is invalid",
                    });
                  }
                  User.findOneAndUpdate(
                    {
                      email: userData.email,
                    },
                    { hash_password: bcrypt.hashSync(req.body.newPassword, 10)},
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
        })
    }
    else {
        res.json("new passwords doesn't match")
    }
}
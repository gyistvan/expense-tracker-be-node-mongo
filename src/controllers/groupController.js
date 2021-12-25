import mongoose from "mongoose";
import { getUser } from "../helpers/authenticateUser";
import { groupSchema } from "../models/groupModel";
import { userSchema } from "../models/userModel";

const Group = mongoose.model("Group", groupSchema);
const User = mongoose.model("User", userSchema);

export const getGroup = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then(() => {
    Group.find({ groupId: req.params.groupId }, (err, group) => {
      if (err) {
        res.send(err);
      }
      res.json(group);
    });
  });
};

export const createGroup = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    let newGroup = new Group({
      ...req.body,
      ownerId: userData._id,
      members: [
        { id: userData._id, name: userData.name, email: userData.email },
      ],
    });
    newGroup.save((err, group) => {
      if (err) {
        res.send(err);
      }
      res.json(group);
    });
  });
};

export const updateGroup = (req, res) => {};

export const deleteGroup = (req, res) => {};

export const inviteUser = async (req, res) => {
  try {
    const owner = await getUser(req.headers.authorization);
    const invitedUser = await User.findOne()
      .where("email")
      .equals(req.body.email)
      .select("pendingInvites")
      .exec();
    const group = await Group.findOne()
      .where("groupId")
      .equals(req.params.groupId)
      .select("ownerId name invited")
      .exec();
    if (!invitedUser){
      res.status(400).send({message: "SHARED_COMPONENTS.NOTIFICATIONS.USER_NOT_FOUND"})
    }
    if (!group){
      res.status(400).send({message: "SHARED_COMPONENTS.NOTIFICATIONS.GROUP_NOT_FOUND"})
    }
    if (owner && invitedUser && group) {
      User.findOneAndUpdate(
        { email: req.body.email },
        {
          pendingInvites: {
            [req.params.groupId]: group.name,
            ...invitedUser.pendingInvites,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        },
        (err, user) => {
          if (err) {
            res.send(err);
          }
        }
      );
      Group.findOneAndUpdate(
        { groupId: req.params.groupId },
        { invited: { [req.body.email]: "", ...group.invited } },
        {
          new: true,
          useFindAndModify: false,
        },
        (err, newGroup) => {
          if (err) {
            res.send(err);
          }
          res.status(200).json(newGroup);
        }
      );
    }
  } catch (error) {
    res.send(error);
  }
};

export const acceptInvite = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    Group.findOne({ groupId: userData.groupId }, (err, oldGroup) => {
      if (err) {
        throw err;
      }
      if (oldGroup) {
        let groupMembers = oldGroup.members.filter(
          (member) => member.email !== userData.email
        );
        Group.findOneAndUpdate(
          { groupId: userData.groupId },
          { members: groupMembers },
          null,
          (err) => {
            if (err) {
              throw err;
            }
          }
        );
      }
    });
    let pendingInvites = userData.pendingInvites;
    delete pendingInvites[req.params.groupId];
    User.findOneAndUpdate(
      { email: userData.email },
      {
        groupId: req.params.groupId,
        pendingInvites: pendingInvites,
      },
      {
        new: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          res.send(err);
        }
        Group.findOne({ groupId: req.params.groupId }, (err, group) => {
          if (err) {
            res.send(err);
          }
          let invited = group.invited;
          let groupMembers = group.members;
          groupMembers.push({
            id: userData._id,
            name: userData.name,
            email: userData.email,
          });
          delete invited[userData.email];
          Group.findOneAndUpdate(
            { groupId: req.params.groupId },
            { invited: invited, members: groupMembers },
            {
              new: true,
              useFindAndModify: false,
            },
            (err, newGroup) => {
              if (err) {
                res.send(err);
              }
              res.send({ group: newGroup });
            }
          );
        });
      }
    );
  });
};

export const declineInvite = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    let pendingInvites = userData.pendingInvites;
    delete pendingInvites[req.params.groupId];
    User.findOneAndUpdate(
      { email: userData.email },
      { pendingInvites: pendingInvites },
      {
        new: true,
        useFindAndModify: false,
      },
      (err, user) => {
        if (err) {
          res.send(err);
        }
        Group.findOne({ groupId: req.params.groupId }, (err, oldGroup) => {
          if (err) {
            res.send(err);
          }
          let invited = oldGroup.invited;
          delete invited[userData.email];
          Group.findOneAndUpdate(
            { groupId: req.params.groupId },
            { invited: invited },
            {
              new: true,
              useFindAndModify: false,
            },
            (err, newGroup) => {
              if (err) {
                res.send(err);
              }
              res.send({ message: "SHARED_COMPONENTS.NOTIFICATIONS.DECLINE_INVITATION_SUCCESS" });
            }
          );
        });
      }
    );
  });
};

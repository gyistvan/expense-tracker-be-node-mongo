import moment from "moment";
import mongoose from "mongoose";
import { getUser } from "../helpers/authenticateUser.js";
import { savingSchema } from "../models/savingModel.js";

const Saving = mongoose.model("Saving", savingSchema);

export const getSavingPercentForMonth = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    Saving.find(
      {
        appliedMonth: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        groupId: userData.groupId,
      },
      (err, saving) => {
        if (err) {
          res.send(err);
        }
        res.json(saving);
      }
    );
  });
};

export const addNewSaving = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    let newSaving = new Saving({ ...req.body, groupId: userData.groupId });
    newSaving.save((err, saving) => {
      if (err) {
        res.send(err);
      }
      res.json({
        saving,
        error: false,
        message: `SHARED_COMPONENTS.NOTIFICATIONS.SAVING_ADD_SUCCESS`,
        translationParams: {
          year: moment(saving.appliedMonth).format("YYYY."),
          month: `SHARED_COMPONENTS.NOTIFICATIONS.MONTHS.${moment(
            saving.appliedMonth
          )
            .format("MMMM")
            .toUpperCase()}`,
        },
      });
    });
  });
};

export const updateSavingById = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    Saving.findOneAndUpdate(
      {
        appliedMonth: req.body.appliedMonth,
      },
      req.body,
      {
        new: true,
        useFindAndModify: false,
      },
      (err, saving) => {
        if (err) {
          res.send(err);
        }
        res.json({
          saving,
          error: false,
          message: `SHARED_COMPONENTS.NOTIFICATIONS.SAVING_UPDATE_SUCCESS`,
          translationParams: {
            year: moment(saving.appliedMonth).format("YYYY."),
            month: `SHARED_COMPONENTS.NOTIFICATIONS.MONTHS.${moment(
              saving.appliedMonth
            )
              .format("MMMM")
              .toUpperCase()}`,
          },
        });
      }
    );
  });
};

import mongoose from "mongoose";
import { transactionSchema } from "../models/transactionModel.js";
import { getUser } from "../helpers/authenticateUser.js";

const Transaction = mongoose.model("Transaction", transactionSchema);

export const addNewTransaction = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    let newTransaction = new Transaction({
      ...req.body,
      groupId: userData.groupId,
    });
    newTransaction.save((err, transaction) => {
      if (err) {
        res.send({ error: true, message: err.error });
      }
      res.json({
        transaction,
        error: false,
        message: "SHARED_COMPONENTS.NOTIFICATIONS.SPENDING_ADD_SUCCESS",
      });
    });
  });
};

export const getAllTransaction = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    Transaction.find(
      {
        spentAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        groupId: userData.groupId,
      },
      (err, transactions) => {
        if (err) {
          res.send(err);
        }
        res.json(transactions);
      }
    );
  });
};

export const getTransactionById = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then(() => {
    Transaction.findById(req.params.transactionId, (err, transaction) => {
      if (err) {
        res.send(err);
      }
      res.json({ transaction });
    });
  });
};

export const updateTransactionById = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    Transaction.findOneAndUpdate(
      {
        _id: req.params.transactionId,
      },
      req.body,
      {
        new: true,
        useFindAndModify: false,
      },
      (err, transaction) => {
        if (err) {
          res.send(err);
        }
        res.json({
          transaction,
          error: false,
          message: "SHARED_COMPONENTS.NOTIFICATIONS.SPENDING_UPDATE_SUCCESS",
        });
      }
    );
  });
};

export const removeTransactionById = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    Transaction.deleteOne(
      {
        _id: req.params.transactionId,
      },
      (err, transaction) => {
        if (err) {
          res.send({ error: true, message: err.error });
        }
        res.json({
          message: "SHARED_COMPONENTS.NOTIFICATIONS.SPENDING_DELETE_SUCCESS",
          error: false,
        });
      }
    );
  });
};

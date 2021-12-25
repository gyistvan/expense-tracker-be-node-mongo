import mongoose from "mongoose";
import { getUser } from "../helpers/authenticateUser";
import { incomeSchema } from "../models/incomeModel";

const Income = mongoose.model("Income", incomeSchema);

export const addNewIncome = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    let newIncome = new Income({ ...req.body, groupId: userData.groupId });
    newIncome.save((err, income) => {
      if (err) {
        res.send(err);
      }
      res.json({
        income,
        error: false,
        message: "SHARED_COMPONENTS.NOTIFICATIONS.INCOME_ADD_SUCCESS",
      });
    });
  });
};

export const getIncomes = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    Income.find(
      {
        spentAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        groupId: userData.groupId,
      },
      (err, incomes) => {
        if (err) {
          res.send(err);
        }
        res.json(incomes);
      }
    );
  });
};

export const removeIncomeById = (req, res) => {
  const userPromise = getUser(req.headers.authorization);
  userPromise.then((userData) => {
    Income.deleteOne(
      {
        _id: req.params.incomeId,
      },
      (err, income) => {
        if (err) {
          res.send(err);
        }
        res.json({
          error: false,
          message: "SHARED_COMPONENTS.NOTIFICATIONS.INCOME_DELETE_SUCCESS",
        });
      }
    );
  });
};

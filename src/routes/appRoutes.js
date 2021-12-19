import {
  addNewIncome,
  getIncomes,
  removeIncomeById,
} from "../controllers/incomesController";
import {
  addNewSaving,
  getSavingPercentForMonth,
  updateSavingById,
} from "../controllers/savingController";
import {
  addNewTransaction,
  getAllTransaction,
  getTransactionById,
  removeTransactionById,
  updateTransactionById,
} from "../controllers/transactionsController";
import { login, logout, register } from "../controllers/userController.js";

const routes = (app) => {
  app.route("/api/transactions").get(getAllTransaction).post(addNewTransaction);

  app
    .route("/api/transactionById/:transactionId")
    .get(getTransactionById)
    .put(updateTransactionById)
    .delete(removeTransactionById);

  app.route("/api/incomes").get(getIncomes).post(addNewIncome);

  app.route("/api/incomeById/:incomeId").delete(removeIncomeById);

  app
    .route("/api/saving")
    .get(getSavingPercentForMonth)
    .post(addNewSaving)
    .put(updateSavingById);
  app.route("/api/login").post(login);
  app.route("/api/register").post(register);
  app.route("/api/logout").delete(logout);
};

export default routes;

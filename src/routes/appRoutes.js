import {
  acceptInvite,
  createGroup,
  declineInvite,
  getGroup,
  inviteUser,
  updateGroup,
} from "../controllers/groupController";
import {
  addNewIncome,
  getIncomeById,
  getIncomes,
  removeIncomeById,
  updateIncomeById,
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
import {
  login,
  logout,
  profile,
  register,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";

const routes = (app) => {
  app.route("/api/transactions").get(getAllTransaction).post(addNewTransaction);

  app
    .route("/api/transactionById/:transactionId")
    .get(getTransactionById)
    .put(updateTransactionById)
    .delete(removeTransactionById);
  app.route("/api/incomes").get(getIncomes).post(addNewIncome);

  app
    .route("/api/incomeById/:incomeId")
    .get(getIncomeById)
    .delete(removeIncomeById)
    .put(updateIncomeById);

  app
    .route("/api/saving")
    .get(getSavingPercentForMonth)
    .post(addNewSaving)
    .put(updateSavingById);
  app.route("/api/login").post(login);

  app.route("/api/register").post(register);

  app.route("/api/logout").delete(logout);

  app.route("/api/me").get(profile).put(updateProfile);

  app.route("/api/updatePassword").put(updatePassword);

  app.route("/api/group").post(createGroup);

  app.route("/api/group/:groupId").get(getGroup).put(updateGroup);

  app
    .route("/api/group/:groupId/invite")
    .put(inviteUser)
    .get(acceptInvite)
    .delete(declineInvite);
};

export default routes;

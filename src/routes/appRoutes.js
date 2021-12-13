import { addNewIncome, addNewTransaction, getAllTransaction, getTransactionById, removeTransactionById, updateTransactionById } from "../controllers/appControllers"

const routes = (app) => {
    app.route('/api/transactions')
      .get(getAllTransaction)
      .post(addNewTransaction)

    app.route("/api/transactionById/:transactionId")
       .get(getTransactionById)
       .put(updateTransactionById)
       .delete(removeTransactionById)

    app.route("/api/income")
       .post(addNewIncome)
}

export default routes
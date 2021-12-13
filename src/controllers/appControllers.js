import mongoose from "mongoose";
import { incomeSchema, transactionSchema } from "../models/appModels"

const Transaction = mongoose.model("Transaction", transactionSchema)
const Income = mongoose.model("Invome", incomeSchema)

export const addNewTransaction = (req,res) => {
    let newTransaction = new Transaction(req.body);

    newTransaction.save((err, transaction) => {
        if (err){
            res.send(err)
        }
        res.json(transaction)
    }) 
}

export const getAllTransaction = (req,res) => {
    Transaction.find( {} ,(err, transactions) => {
        if (err){
            res.send(err)
        }
        res.json(transactions)
    }) 
}

export const getTransactionById = (req,res) => {
    Transaction.findById( req.params.transactionId, (err, transaction) => {
        if (err){
            res.send(err)
        }
        res.json(transaction)
    }) 
}

export const updateTransactionById = (req,res) => {
    console.log(req.body)
    Transaction.findOneAndUpdate({ 
        _id: req.params.transactionId}, 
        req.body, 
        { 
            new: true, 
            useFindAndModify: false 
        }, 
        (err, transaction) => {
        if (err){
            res.send(err)
        }
        res.json(transaction)
    }) 
}

export const removeTransactionById = (req,res) => {
    Transaction.deleteOne({ 
        _id: req.params.transactionId}, 
        (err, transaction) => {
        if (err){
            res.send(err) 
        }
        res.json({ message: 'successfully deleted transaction' })
    }) 
}

export const addNewIncome = (req,res) => {
    let newIncome = new Income(req.body);

    newIncome.save((err, income) => {
        if (err){
            res.send(err)
        }
        res.json(income)
    }) 
}
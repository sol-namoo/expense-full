const express = require("express");
const cors = require("cors");
const { expenses, nextId } = require("./temp-data");

const app = express();

const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.post("/expenses", (req, res) => {
  const newExpense = {
    id: nextId++,
    merchant: req.body.merchant,
    amount: req.body.amount,
    currency: req.body.currency,
    status: req.body.status,
  };
  expenses.push(newExpense);

  res.status(201).json(newExpense);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const cors = require("cors");
const { expenses, setNextId, getNextId } = require("./temp-data");

const app = express();

const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/expenses", (req, res) => {
  res.status(200).json(expenses);
});

app.post("/expenses", (req, res) => {
  console.log(req.body);
  const currentId = getNextId();
  const newExpense = {
    id: currentId,
    merchant: req.body.merchant,
    amount: req.body.amount,
    currency: req.body.currency,
    status: "pending",
  };
  expenses.push(newExpense);
  setNextId(currentId + 1);

  res.status(201).json(newExpense);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

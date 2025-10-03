import { useState, useEffect } from "react";
import "./App.css";
import type { Expenses } from "./types";

function App() {
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_SERVER_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant,
        amount,
        currency,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMerchant("");
        setAmount(0);
        setExpenses([...expenses, data]);
      });
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/expenses`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  return (
    <>
      <div>
        <h1>Add Expense</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label>Merchant</label>
              <input
                type="text"
                name="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Currency</label>
              <input
                type="text"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Add Expense</button>
        </form>
      </div>
      <div>
        <h1>Expenses</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Merchant</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.id}</td>
                <td>{expense.merchant}</td>
                <td>{expense.amount}</td>
                <td>{expense.currency}</td>
                <td>{expense.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;

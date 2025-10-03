import { useState, useEffect } from "react";
import "./App.css";
import type { Expenses } from "./types";

function App() {
  const [expenses, setExpenses] = useState<Expenses[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/expenses`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  return (
    <>
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
    </>
  );
}

export default App;

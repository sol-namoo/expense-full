// 가짜 데이터베이스 (In-memory DB)
let nextId = 4;
let expenses = [
  {
    id: 1,
    merchant: "Starbucks",
    amount: 5.5,
    currency: "GBP",
    status: "approved",
  },
  {
    id: 2,
    merchant: "Tesco",
    amount: 12.0,
    currency: "GBP",
    status: "pending",
  },
  {
    id: 3,
    merchant: "Amazon",
    amount: 150.0,
    currency: "GBP",
    status: "approved",
  },
];

module.exports = { expenses, nextId };

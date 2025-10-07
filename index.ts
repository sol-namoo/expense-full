import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { db } from "./temp-data";
import { Expense, CreateExpenseDTO, UpdateExpenseDTO } from "./types";
import { nowISO, uid } from "./utils";

/** ---------- Express App & Middlewares ---------- */
const app = express();

const port = 4000;

app.use(cors());
app.use(express.json());

// logger
app.use((req, _res, next) => {
  console.log(`[${nowISO()}] ${req.method} ${req.url}`);
  next();
});

/** ---------- Routes: /health ---------- */
app.get("/health", (_req, res) => {
  res.json({ ok: true, time: nowISO() });
});

/** ---------- Routes: /expenses ---------- */

// basic validation helper
const currencies = ["USD", "EUR", "GBP"];
const categories = ["MEAL", "TRAVEL", "OTHER"];
const countries = ["US", "DE", "FR", "GB", "VE"];

function assertExpenseInput(body: any): asserts body is CreateExpenseDTO {
  if (typeof body !== "object") throw new Error("Invalid payload");
  if (!body.employeeId || !body.employeeName)
    throw new Error("Missing employee");
  if (!countries.includes(body.country)) throw new Error("Invalid country");
  if (!currencies.includes(body.currency)) throw new Error("Invalid currency");
  if (typeof body.amount !== "number" || body.amount <= 0)
    throw new Error("Invalid amount");
  if (!categories.includes(body.category)) throw new Error("Invalid category");
}

function assertPartialExpenseInput(
  body: any
): asserts body is UpdateExpenseDTO {
  if (typeof body !== "object") throw new Error("Invalid payload");
  if (body.amount !== undefined && typeof body.amount !== "number")
    throw new Error("Invalid amount");
  if (body.currency && !currencies.includes(body.currency))
    throw new Error("Invalid currency");
  if (body.category && !categories.includes(body.category))
    throw new Error("Invalid category");
  if (body.approved !== undefined && typeof body.approved !== "boolean")
    throw new Error("Invalid approved");
}

/**
 * GET /expenses
 * Query:
 * - country=GB
 * - currency=USD
 * - approved=true|false
 * - q=kim (employeeName)
 * - page=1&limit=20
 * - sort=createdAt|-amount
 */

app.get("/expenses", (req, res: Response) => {
  const {
    country,
    currency,
    approved,
    q,
    page = "1",
    limit = "20",
    sort,
  } = req.query as Record<string, string>;

  let data = [...db];

  if (country) data = data.filter((expenses) => expenses.country === country);
  if (currency)
    data = data.filter((expenses) => expenses.currency === currency);
  if (approved !== undefined) {
    const bool = approved === "true";
    data = data.filter((e) => e.approved === bool);
  }
  if (q) {
    const k = q.toLowerCase();
    data = data.filter((expenses) => {
      expenses.employeeName.toLowerCase().includes(k);
    });
  }

  if (sort) {
    const desc = sort.startsWith("-");
    const key = desc ? sort.slice(1) : sort;
    data.sort((a: any, b: any) => {
      if (a[key] < b[key]) return desc ? 1 : -1;
      if (a[key] > b[key]) return desc ? -1 : 1;
      return 0;
    });
  }

  const p = Math.max(1, parseInt(page, 10));
  const l = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const start = (p - 1) * l;
  const end = start + l;

  res.json({
    totla: data.length,
    page: p,
    limit: l,
    items: data.slice(start, end),
  });
});

/**
 * POST /expenses
 * Body: CreateExpenseDTO
 */

app.post("/expenses", (req: Request, res: Response, next: NextFunction) => {
  try {
    assertExpenseInput(req.body);
    const payload = req.body;

    const newItem: Expense = {
      id: uid(),
      employeeId: payload.employeeId,
      employeeName: payload.employeeName,
      country: payload.country,
      currency: payload.currency,
      amount: payload.amount,
      category: payload.category,
      createdAt: nowISO(),
      approved: false,
    };

    db.push(newItem);
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /expenses/:id
 * Body: UpdateExpenseDTO
 */

app.patch("/expenses/:id", (req: Request, res: Response) => {
  try {
    assertPartialExpenseInput(req.body);

    const { id } = req.params;
    const idx = db.findIndex((e) => e.id === id);
    if (idx === -1)
      return res.status(404).json({ message: "expense not found" });

    const update = req.body as UpdateExpenseDTO;
    db[idx] = { ...db[idx], ...update };
    res.json(db[idx]);
  } catch (err) {}
});

/**
 * DELETE /expenses/:id
 */
app.delete("/expenses/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const before = db.length;
  const nextData = db.filter((e) => e.id !== id);
  if (nextData.length === before)
    return res.status(404).json({ message: "Not found" });

  db.length = 0;
  db.push(...nextData);
  res.status(204).send();
});

/**
 * GET /expenses/summary
 * - 간단 집계: 국가/통화별 합계
 */

app.get("/expenses/summary", (_req, res: Response) => {
  const byCountry = db.reduce<Record<string, number>>((acc, crr) => {
    acc[crr.country] = acc[crr.country] ?? 0 + crr.amount;
    return acc;
  }, {});
  const byCurrency = db.reduce<Record<string, number>>((acc, crr) => {
    acc[crr.currency] = acc[crr.currency] ?? 0 + crr.amount;
    return acc;
  }, {});

  res.json({ byCountry, byCurrency });
});

app.use((err: Error, _resreq: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

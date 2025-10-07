type Currency = "USD" | "EUR" | "GBP";
type CountryISO = "US" | "DE" | "FR" | "GB" | "VE";
type Category = "MEAL" | "TRAVEL" | "OTHER";

interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  country: CountryISO;
  currency: Currency;
  amount: number; // 원화/달러 등 통화 단위는 currency로 구분
  category: Category;
  createdAt: string; // ISO string
  approved: boolean;
}

interface CreateExpenseDTO {
  employeeId: string;
  employeeName: string;
  country: CountryISO;
  currency: Currency;
  amount: number;
  category: Category;
}

interface UpdateExpenseDTO {
  currency?: Currency;
  amount?: number;
  category?: Category;
  approved?: boolean;
}

export type {
  Currency,
  CountryISO,
  Expense,
  CreateExpenseDTO,
  UpdateExpenseDTO,
};

export interface SalesRecord {
  id: string;
  date: string;
  year: number;
  month: string;
  region: 'North' | 'South' | 'East' | 'West';
  category: 'Technology' | 'Office Supplies' | 'Furniture';
  subCategory: string;
  sales: number;
  profit: number;
  orders: number;
  customerSegment: 'Consumer' | 'Corporate' | 'Small Business';
}

export const salesDashboardSampleData: SalesRecord[] = [
  // 2024 Records
  { id: "REC-2401", date: "2024-01-15", year: 2024, month: "Jan", region: "North", category: "Technology", subCategory: "Phones", sales: 48500, profit: 12200, orders: 42, customerSegment: "Corporate" },
  { id: "REC-2402", date: "2024-02-12", year: 2024, month: "Feb", region: "West", category: "Furniture", subCategory: "Chairs", sales: 34200, profit: 6100, orders: 35, customerSegment: "Consumer" },
  { id: "REC-2403", date: "2024-03-20", year: 2024, month: "Mar", region: "East", category: "Office Supplies", subCategory: "Binders", sales: 22100, profit: 5800, orders: 58, customerSegment: "Small Business" },
  { id: "REC-2404", date: "2024-04-18", year: 2024, month: "Apr", region: "South", category: "Technology", subCategory: "Accessories", sales: 51200, profit: 14500, orders: 64, customerSegment: "Consumer" },
  { id: "REC-2405", date: "2024-05-22", year: 2024, month: "May", region: "North", category: "Furniture", subCategory: "Tables", sales: 42000, profit: 7100, orders: 28, customerSegment: "Corporate" },
  { id: "REC-2406", date: "2024-06-19", year: 2024, month: "Jun", region: "West", category: "Technology", subCategory: "Laptops", sales: 78000, profit: 21500, orders: 49, customerSegment: "Corporate" },
  { id: "REC-2407", date: "2024-07-14", year: 2024, month: "Jul", region: "South", category: "Office Supplies", subCategory: "Paper", sales: 18500, profit: 4900, orders: 55, customerSegment: "Consumer" },
  { id: "REC-2408", date: "2024-08-25", year: 2024, month: "Aug", region: "East", category: "Technology", subCategory: "Phones", sales: 49800, profit: 13100, orders: 38, customerSegment: "Small Business" },
  { id: "REC-2409", date: "2024-09-17", year: 2024, month: "Sep", region: "West", category: "Office Supplies", subCategory: "Storage", sales: 31000, profit: 7900, orders: 46, customerSegment: "Consumer" },
  { id: "REC-2410", date: "2024-10-23", year: 2024, month: "Oct", region: "North", category: "Technology", subCategory: "Accessories", sales: 63000, profit: 17200, orders: 72, customerSegment: "Corporate" },
  { id: "REC-2411", date: "2024-11-16", year: 2024, month: "Nov", region: "West", category: "Furniture", subCategory: "Chairs", sales: 84000, profit: 16800, orders: 85, customerSegment: "Consumer" },
  { id: "REC-2412", date: "2024-12-20", year: 2024, month: "Dec", region: "South", category: "Technology", subCategory: "Phones", sales: 92000, profit: 26000, orders: 98, customerSegment: "Corporate" },

  // 2025 Records
  { id: "REC-2501", date: "2025-01-10", year: 2025, month: "Jan", region: "North", category: "Technology", subCategory: "Phones", sales: 54000, profit: 14800, orders: 48, customerSegment: "Corporate" },
  { id: "REC-2502", date: "2025-02-14", year: 2025, month: "Feb", region: "West", category: "Furniture", subCategory: "Chairs", sales: 41000, profit: 7800, orders: 42, customerSegment: "Consumer" },
  { id: "REC-2503", date: "2025-03-19", year: 2025, month: "Mar", region: "East", category: "Office Supplies", subCategory: "Binders", sales: 26500, profit: 7100, orders: 63, customerSegment: "Small Business" },
  { id: "REC-2504", date: "2025-04-12", year: 2025, month: "Apr", region: "South", category: "Technology", subCategory: "Accessories", sales: 62000, profit: 18100, orders: 75, customerSegment: "Consumer" },
  { id: "REC-2505", date: "2025-05-18", year: 2025, month: "May", region: "North", category: "Furniture", subCategory: "Bookcases", sales: 49000, profit: 8900, orders: 36, customerSegment: "Corporate" },
  { id: "REC-2506", date: "2025-06-22", year: 2025, month: "Jun", region: "West", category: "Technology", subCategory: "Laptops", sales: 91000, profit: 26500, orders: 58, customerSegment: "Corporate" },
  { id: "REC-2507", date: "2025-07-15", year: 2025, month: "Jul", region: "South", category: "Office Supplies", subCategory: "Paper", sales: 23000, profit: 6200, orders: 68, customerSegment: "Consumer" },
  { id: "REC-2508", date: "2025-08-20", year: 2025, month: "Aug", region: "East", category: "Technology", subCategory: "Phones", sales: 58000, profit: 16200, orders: 47, customerSegment: "Small Business" },
  { id: "REC-2509", date: "2025-09-14", year: 2025, month: "Sep", region: "West", category: "Office Supplies", subCategory: "Appliances", sales: 38000, profit: 9800, orders: 54, customerSegment: "Consumer" },
  { id: "REC-2510", date: "2025-10-28", year: 2025, month: "Oct", region: "North", category: "Technology", subCategory: "Accessories", sales: 74000, profit: 21500, orders: 84, customerSegment: "Corporate" },
  { id: "REC-2511", date: "2025-11-20", year: 2025, month: "Nov", region: "West", category: "Furniture", subCategory: "Chairs", sales: 99000, profit: 21200, orders: 96, customerSegment: "Consumer" },
  { id: "REC-2512", date: "2025-12-18", year: 2025, month: "Dec", region: "South", category: "Technology", subCategory: "Phones", sales: 112000, profit: 32500, orders: 115, customerSegment: "Corporate" },

  // 2026 Records
  { id: "REC-2601", date: "2026-01-12", year: 2026, month: "Jan", region: "North", category: "Technology", subCategory: "Phones", sales: 61000, profit: 17400, orders: 55, customerSegment: "Corporate" },
  { id: "REC-2602", date: "2026-02-18", year: 2026, month: "Feb", region: "West", category: "Furniture", subCategory: "Chairs", sales: 46000, profit: 9200, orders: 46, customerSegment: "Consumer" },
  { id: "REC-2603", date: "2026-03-24", year: 2026, month: "Mar", region: "East", category: "Office Supplies", subCategory: "Binders", sales: 29800, profit: 8200, orders: 71, customerSegment: "Small Business" },
  { id: "REC-2604", date: "2026-04-16", year: 2026, month: "Apr", region: "South", category: "Technology", subCategory: "Accessories", sales: 71000, profit: 21200, orders: 82, customerSegment: "Consumer" },
  { id: "REC-2605", date: "2026-05-19", year: 2026, month: "May", region: "North", category: "Furniture", subCategory: "Tables", sales: 55000, profit: 10400, orders: 41, customerSegment: "Corporate" },
  { id: "REC-2606", date: "2026-06-25", year: 2026, month: "Jun", region: "West", category: "Technology", subCategory: "Laptops", sales: 105000, profit: 31000, orders: 67, customerSegment: "Corporate" },
  { id: "REC-2607", date: "2026-07-21", year: 2026, month: "Jul", region: "South", category: "Office Supplies", subCategory: "Paper", sales: 26000, profit: 7100, orders: 74, customerSegment: "Consumer" },
  { id: "REC-2608", date: "2026-08-28", year: 2026, month: "Aug", region: "East", category: "Technology", subCategory: "Phones", sales: 67000, profit: 19100, orders: 53, customerSegment: "Small Business" },
  { id: "REC-2609", date: "2026-09-15", year: 2026, month: "Sep", region: "West", category: "Office Supplies", subCategory: "Storage", sales: 43000, profit: 11200, orders: 59, customerSegment: "Consumer" },
  { id: "REC-2610", date: "2026-10-14", year: 2026, month: "Oct", region: "North", category: "Technology", subCategory: "Accessories", sales: 86000, profit: 25400, orders: 94, customerSegment: "Corporate" }
];

export {};

declare global {
  interface IDashboardCount {
    statusCode: number;
    message: string;
    data: { count: number };
  }

  interface IDashboardRevenue {
    statusCode: number;
    message: string;
    data: { monthList: string[]; revenueList: number[] };
  }
}

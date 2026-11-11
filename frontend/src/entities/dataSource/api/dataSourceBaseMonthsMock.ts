import type { DataSourceBaseMonthRow } from "@/entities/dataSource/api/dataSourceBaseMonthRow";

// 1단계에는 LAW 행이 없음
export const dataSourceBaseMonthsMock: DataSourceBaseMonthRow[] = [
	{ source: "RENT_DEAL", baseMonth: { year: 2026, month: 9 } },
	{ source: "SALE_DEAL", baseMonth: { year: 2026, month: 9 } },
	{ source: "BUILDING_REGISTER", baseMonth: { year: 2026, month: 9 } },
];

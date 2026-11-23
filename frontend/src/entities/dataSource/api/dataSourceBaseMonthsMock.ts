import type { DataSourceResponse } from "@/entities/dataSource/api/dataSourceResponse";
import type { ApiResponse } from "@/shared/api/apiResponse";

// 백엔드 응답과 같은 형태. 1단계에는 LAW 행이 없음
export const dataSourceBaseMonthsMock: ApiResponse<DataSourceResponse[]> = {
	data: [
		{ source: "RENT_DEAL", baseMonth: { year: 2026, month: 9 } },
		{ source: "SALE_DEAL", baseMonth: { year: 2026, month: 9 } },
	],
};

import { buildingRegisterBaseMonthMock } from "@/entities/dataSource/api/buildingRegisterBaseMonthMock";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";

/**
 * 데이터 출처 > 건축물대장 기준 월 조회
 *
 * - 백엔드가 없어 목업 반환
 */
export async function getBuildingRegisterBaseMonth(): Promise<YearMonth> {
	return buildingRegisterBaseMonthMock;
}

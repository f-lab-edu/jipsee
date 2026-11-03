import { rentDealBaseMonthMock } from "@/entities/dataSource/api/rentDealBaseMonthMock";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";

/**
 * 데이터 출처 > 실거래 기준 월 조회
 *
 * - 백엔드가 없어 목업 반환
 */
export async function getRentDealBaseMonth(): Promise<YearMonth> {
	return rentDealBaseMonthMock;
}

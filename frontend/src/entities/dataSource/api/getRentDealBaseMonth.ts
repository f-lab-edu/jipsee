import { getDataSourceCards } from "@/entities/dataSource/api/getDataSourceCards";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 데이터 출처 > 실거래 기준 월 조회
 *
 * - 출처 카드 목록에서 RENT_DEAL의 기준 월 반환
 * - 기준 월이 없으면 null 반환
 */
export async function getRentDealBaseMonth(): Promise<Nullable<YearMonth>> {
	const cards = await getDataSourceCards();

	return cards.find((card) => card.source === "RENT_DEAL")?.baseMonth ?? null;
}

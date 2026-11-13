import { dataSourceCardCopy } from "@/entities/dataSource/config/dataSourceCardCopy";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 데이터 출처 > 갱신 주기와 기준 월 줄 생성
 *
 * - 기준 월이 있으면 `{주기} 갱신, {YYYY.MM} 기준` 반환
 * - 기준 월이 없으면 `{주기} 갱신`만 반환
 */
export function toUpdateLine(
	updateCycle: string,
	baseMonth: Nullable<YearMonth>,
): string {
	const cycleText = `${updateCycle} ${dataSourceCardCopy.updateSuffix}`;

	if (baseMonth === null) {
		return cycleText;
	}

	return `${cycleText}, ${formatYearMonth(baseMonth)} ${dataSourceCardCopy.baseMonthSuffix}`;
}

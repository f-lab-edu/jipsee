import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";

/** 최근 신규 전세 월이 있으면 그 월을, 없으면 신규 전세가 없다는 문구를 반환함 */
export function toJeonseDetail(building: BuildingSummary): string {
	if (building.latestNewJeonseMonth === null) {
		return "최근 12개월 신규 전세 없음";
	}

	return `최근 신규 전세 ${formatYearMonth(building.latestNewJeonseMonth)}`;
}

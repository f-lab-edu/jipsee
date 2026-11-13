import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 건물 상세 > 조건 확장 안내 제목
 *
 * - 기준 건수 이상이면 `null` 반환
 * - 0건이면 거래가 없다는 제목 반환
 * - 그 사이면 건수가 들어간 제목 반환
 */
export function toNearbyNoticeTitle(count: number): Nullable<string> {
	if (count >= nearbyDealsOptions.noticeCountThreshold) {
		return null;
	}

	if (count === 0) {
		return nearbyDealsCopy.noticeNone;
	}

	return `${nearbyDealsCopy.summaryLabel} ${count}${nearbyDealsCopy.countUnit}`;
}

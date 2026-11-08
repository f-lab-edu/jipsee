import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import { paths } from "@/shared/routes/paths";

/**
 * 주변 거래 필터 > 칩 링크 주소 생성
 *
 * - 현재 조건에 바꿀 항목을 덮어 반경, 기간, 유형 순서로 쿼리 구성
 *
 * @param change 현재 조건에서 바꿀 항목
 */
export function toNearbyFilterHref(
	buildingId: number,
	condition: NearbyDealsCondition,
	change: Partial<NearbyDealsCondition>,
): string {
	const next = { ...condition, ...change };
	const query = new URLSearchParams({
		radius: String(next.radius),
		period: String(next.period),
		type: next.type,
	});

	return `${paths.building(buildingId)}?${query.toString()}`;
}

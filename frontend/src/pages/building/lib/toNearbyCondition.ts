import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";

/**
 * 건물 상세 > 주변 거래 조건 변환
 *
 * - 항목마다 값이 허용 값과 문자열로 정확히 같으면 그 값 반환
 * - 값이 없거나 배열이거나 허용 값이 아니면 그 항목만 기본값 반환
 */
export function toNearbyCondition(
	searchParams: Record<string, string | string[] | undefined>,
): NearbyDealsCondition {
	const { defaultCondition } = nearbyDealsOptions;

	return {
		radius:
			nearbyDealsOptions.radii.find(
				(option) => String(option) === searchParams.radius,
			) ?? defaultCondition.radius,
		period:
			nearbyDealsOptions.periods.find(
				(option) => String(option) === searchParams.period,
			) ?? defaultCondition.period,
		type:
			nearbyDealsOptions.types.find((option) => option === searchParams.type) ??
			defaultCondition.type,
	};
}

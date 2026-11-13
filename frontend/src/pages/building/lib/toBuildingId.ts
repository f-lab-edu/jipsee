import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

const buildingIdPattern = /^[1-9]\d*$/;

/**
 * 건물 상세 > 건물 id 변환
 *
 * - 양의 정수 문자열이면 숫자 반환
 * - 그 밖의 문자열이면 null 반환
 */
export function toBuildingId(value: string): Nullable<number> {
	if (!buildingIdPattern.test(value)) {
		return null;
	}

	return Number(value);
}

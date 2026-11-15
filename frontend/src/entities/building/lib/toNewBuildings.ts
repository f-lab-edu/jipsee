import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

/**
 * 건물 > 새로 붙일 건물 추리기
 *
 * - 이미 불러온 건물과 번호가 같은 건물을 뺀 나머지 반환
 * - 오프셋 페이지는 데이터가 바뀌면 같은 건물이 두 페이지에 나올 수 있음
 */
export function toNewBuildings(
	loaded: BuildingSummary[],
	incoming: BuildingSummary[],
): BuildingSummary[] {
	const loadedIds = new Set(loaded.map((building) => building.id));

	return incoming.filter((building) => !loadedIds.has(building.id));
}

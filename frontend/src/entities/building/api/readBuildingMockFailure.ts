import type { BuildingMockFailure } from "@/entities/building/api/buildingMockFailure";
import { readMockSetting } from "@/shared/lib/mock/readMockSetting";

/**
 * 건물 > 목업 실패 조회
 *
 * - 쿠키 jipsee-mock-building 또는 환경 변수 MOCK_BUILDING의 값으로 결정
 * - 검색 결과의 일반 오류와 요청 제한, 건물 상세의 일반 오류와 요청 제한 화면을 확인하는 데 씀
 * - 값이 없거나 알 수 없으면 none 반환
 * - 운영 빌드에서는 항상 none 반환
 */
export async function readBuildingMockFailure(): Promise<BuildingMockFailure> {
	const failure = await readMockSetting<BuildingMockFailure>({
		cookieName: "jipsee-mock-building",
		envValue: process.env.MOCK_BUILDING,
		values: [
			"none",
			"searchFailed",
			"searchRateLimited",
			"buildingFailed",
			"buildingRateLimited",
		],
	});

	return failure ?? "none";
}

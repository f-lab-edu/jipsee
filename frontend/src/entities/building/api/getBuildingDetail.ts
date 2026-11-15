import { cache } from "react";
import { buildingDetailMock } from "@/entities/building/api/buildingDetailMock";
import { buildingMockFailure } from "@/entities/building/api/buildingMockFailureSwitch";
import type { BuildingDetailResult } from "@/entities/building/model/buildingDetailResult";

/**
 * 건물 > 상세 조회
 *
 * - 백엔드가 429를 주면 rateLimited 반환
 * - 그 밖의 호출 실패는 오류를 던져 오류 경계(error.tsx)가 화면 전체를 오류로 바꿈
 * - id가 같은 건물이 있으면 found와 상세 반환
 * - 없으면 notFound 반환
 * - 백엔드가 없어 목업이 조회를 대신하고, 요청 제한과 호출 실패는 목업 스위치로 만듦
 * - 한 요청 안에서 같은 id를 여러 번 불러도 한 번만 조회하도록 cache로 감쌈
 */
export const getBuildingDetail = cache(
	async (id: number): Promise<BuildingDetailResult> => {
		if (buildingMockFailure === "buildingFailed") {
			throw new Error("건물 상세 호출 실패 목업");
		}

		if (buildingMockFailure === "buildingRateLimited") {
			return { kind: "rateLimited" };
		}

		const detail = buildingDetailMock.find((building) => building.id === id);

		if (detail === undefined) {
			return { kind: "notFound" };
		}

		return { kind: "found", detail };
	},
);

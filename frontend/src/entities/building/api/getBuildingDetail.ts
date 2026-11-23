import { cache } from "react";
import { fetchBuildingDetail } from "@/entities/building/api/fetchBuildingDetail";
import { findBuildingDetailMock } from "@/entities/building/api/findBuildingDetailMock";
import { readBuildingMockFailure } from "@/entities/building/api/readBuildingMockFailure";
import { toBuildingDetail } from "@/entities/building/lib/toBuildingDetail";
import type { BuildingDetailResult } from "@/entities/building/model/buildingDetailResult";
import { hasApiUrl } from "@/shared/api/hasApiUrl";

/**
 * 건물 > 상세 조회
 *
 * - API_URL이 있으면 백엔드를 조회하고 BUILDING_NOT_FOUND 응답은 notFound 반환
 * - 백엔드 호출 실패는 오류를 던져 오류 경계(error.tsx)가 화면 전체를 오류로 바꿈
 * - API_URL이 없으면 백엔드 응답과 같은 형태의 목업이 조회를 대신하고, 요청 제한과 호출 실패는 목업 스위치로 만듦
 * - 목업에서 id가 같은 건물이 있으면 found와 상세 반환
 * - 없으면 notFound 반환
 * - 한 요청 안에서 같은 id를 여러 번 불러도 한 번만 조회하도록 cache로 감쌈
 */
export const getBuildingDetail = cache(
	async (id: string): Promise<BuildingDetailResult> => {
		if (hasApiUrl()) {
			return fetchBuildingDetail(id);
		}

		const failure = await readBuildingMockFailure();

		if (failure === "buildingFailed") {
			throw new Error("건물 상세 호출 실패 목업");
		}

		if (failure === "buildingRateLimited") {
			return { kind: "rateLimited" };
		}

		const body = findBuildingDetailMock(id);

		if (body === null) {
			return { kind: "notFound" };
		}

		return { kind: "found", detail: toBuildingDetail(body) };
	},
);

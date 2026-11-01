import { toJeonseDetail } from "@/entities/building/lib/toJeonseDetail";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

/** 사용승인 연도가 있으면 전세 정보 앞에 붙여, 건물 상세 문구를 반환함 */
export function toBuildingDetail(building: BuildingSummary): string {
	const jeonseDetail = toJeonseDetail(building);

	if (building.useApprovalYear === null) {
		return jeonseDetail;
	}

	return `${building.useApprovalYear}년 사용승인, ${jeonseDetail}`;
}

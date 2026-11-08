import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";

/**
 * 건물 > 거래 구분 문구
 *
 * - 매매는 계약 구분과 관계없이 매매만 반환
 * - 전세와 월세는 계약 구분이 있으면 앞에 붙여 반환
 * - 전세와 월세는 계약 구분이 없으면 유형만 반환
 */
export function toDealLabel(
	deal: Pick<BuildingDeal, "type" | "contract">,
): string {
	const typeLabel = buildingDealCopy.typeLabels[deal.type];

	if (deal.type === "sale" || deal.contract === null) {
		return typeLabel;
	}

	return `${buildingDealCopy.contractLabels[deal.contract]} ${typeLabel}`;
}

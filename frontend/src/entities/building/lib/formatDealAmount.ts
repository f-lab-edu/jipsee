import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import { formatAmount } from "@/entities/building/lib/formatAmount";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 건물 > 거래 금액 문구
 *
 * - 전세와 매매는 월세 금액과 관계없이 금액만 반환
 * - 월세는 보증금과 월 금액을 함께 반환
 * - 월세인데 월 금액이 없으면 보증금만 반환
 */
export function formatDealAmount(
	type: BuildingDeal["type"],
	amount: number,
	monthlyRent: Nullable<number>,
): string {
	if (type !== "wolse") {
		return formatAmount(amount);
	}

	const deposit = `${buildingDealCopy.deposit} ${formatAmount(amount)}`;

	if (monthlyRent === null) {
		return deposit;
	}

	return `${deposit}${buildingDealCopy.amountSeparator}${buildingDealCopy.monthlyRent} ${formatAmount(monthlyRent)}`;
}

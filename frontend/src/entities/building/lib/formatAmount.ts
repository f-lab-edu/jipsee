import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";

/**
 * 건물 > 금액 문구
 *
 * - 천 단위마다 쉼표를 붙이고 뒤에 만원을 붙여 반환
 */
export function formatAmount(amount: number): string {
	return `${amount.toLocaleString("en-US")}${buildingDealCopy.amountUnit}`;
}

import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";

const manPerEok = 10000;

/**
 * 건물 > 금액 문구
 *
 * - 1억 미만은 쉼표를 붙인 금액 뒤에 만원을 붙여 반환
 * - 1억 이상은 억 단위 수 뒤에 억을 붙여 반환
 * - 1억 이상이고 나머지가 있으면 한 칸 띄우고 쉼표를 붙인 나머지와 만원을 붙여 반환
 *
 * @param amount 만원 단위 정수
 */
export function formatAmount(amount: number): string {
	const eok = Math.floor(amount / manPerEok);
	const man = amount % manPerEok;
	const manText = `${man.toLocaleString("en-US")}${buildingDealCopy.amountUnit}`;

	if (eok === 0) {
		return manText;
	}

	const eokText = `${eok}${buildingDealCopy.eokUnit}`;

	if (man === 0) {
		return eokText;
	}

	return `${eokText} ${manText}`;
}

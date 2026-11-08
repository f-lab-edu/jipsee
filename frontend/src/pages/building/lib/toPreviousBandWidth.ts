import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { toMonthPercent } from "@/pages/building/lib/toMonthPercent";
import type { ChartAxis } from "@/pages/building/model/chartAxis";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

const maxExtraPercent = 12;
const emptyCurrentPercent = 100;
const roundingFactor = 100;

/**
 * 건물 상세 > 이전 건물 영역 폭 계산
 *
 * - 이전 건물 거래가 없으면 null 반환
 * - 이전 건물의 가장 최근 거래 위치와 현재 건물의 가장 오래된 거래 위치의 가운데까지 영역 폭 계산
 * - 이전 건물의 가장 최근 거래 위치에서 12%를 넘지 않음
 * - 월세 거래도 위치 계산에 포함하고, 소수 둘째 자리까지 반올림
 */
export function toPreviousBandWidth(
	deals: BuildingDeal[],
	previousDeals: BuildingDeal[],
	axis: ChartAxis,
): Nullable<number> {
	if (previousDeals.length === 0) {
		return null;
	}

	const toPercent = ({ month }: BuildingDeal) =>
		toMonthPercent(month, axis.startYear, axis.total);
	const lastPreviousPercent = Math.max(...previousDeals.map(toPercent));
	let firstCurrentPercent = emptyCurrentPercent;

	if (deals.length > 0) {
		firstCurrentPercent = Math.min(...deals.map(toPercent));
	}

	const width = Math.min(
		(lastPreviousPercent + firstCurrentPercent) / 2,
		lastPreviousPercent + maxExtraPercent,
	);

	return Math.round(width * roundingFactor) / roundingFactor;
}

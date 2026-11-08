import { HStack, Text } from "@seed-design/react";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import { nearbyDealsSummaryStyles } from "@/pages/building/config/nearbyDealsSummaryStyles";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsSummaryProps {
	layout: ResponsiveVariant;
	count: number;
	baseMonth: YearMonth;
}

/**
 * 건물 상세 > 주변 거래 건수 줄
 *
 * - 왼쪽에 "조건에 맞는 거래"와 굵은 건수, 오른쪽에 실거래 기준 월 출력
 * - 양끝 정렬에 기준선 정렬을 적용
 *
 * @param layout 글자 크기와 위쪽 여백을 정함
 * @param baseMonth 실거래 기준 월
 */
export default function NearbyDealsSummary({
	layout,
	count,
	baseMonth,
}: NearbyDealsSummaryProps) {
	const style = nearbyDealsSummaryStyles[layout];

	return (
		<HStack data-area={`nearby-summary-${layout}`} {...style.summary}>
			<Text as="p" {...style.count}>
				{`${nearbyDealsCopy.summaryLabel} `}
				<Text as="strong" {...style.countValue}>
					{`${count}${nearbyDealsCopy.countUnit}`}
				</Text>
			</Text>
			<Text {...style.baseMonth}>
				{`${formatYearMonth(baseMonth)} ${nearbyDealsCopy.baseMonthSuffix}`}
			</Text>
		</HStack>
	);
}

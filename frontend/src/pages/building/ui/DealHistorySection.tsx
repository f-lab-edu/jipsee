import { Text, VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import { dealHistoryCopy } from "@/pages/building/config/dealHistoryCopy";
import { dealHistorySectionStyles } from "@/pages/building/config/dealHistorySectionStyles";
import BuildingDealList from "@/pages/building/ui/BuildingDealList";
import DealChart from "@/pages/building/ui/DealChart";
import PreviousBuildingDeals from "@/pages/building/ui/PreviousBuildingDeals";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DealHistorySectionProps {
	layout: ResponsiveVariant;
	detail: BuildingDetail;
	rentDealBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 거래 이력 영역
 *
 * - 제목 아래에 거래 점 그래프 출력
 * - 그래프 아래에 현재 건물 거래 목록 출력
 * - 현재 건물 거래가 없으면 목록을 출력하지 않음
 * - 이전 건물 거래가 있으면 현재 건물 목록 아래에 이전 건물 목록 출력
 * - 모바일은 흰 영역, 데스크톱은 테두리가 있는 카드로 출력
 *
 * @param layout 섹션 모양과 `id` 접미사를 정함
 * @param rentDealBaseMonth 그래프 가로축의 끝 연도를 정함
 */
export default function DealHistorySection({
	layout,
	detail,
	rentDealBaseMonth,
}: DealHistorySectionProps) {
	const style = dealHistorySectionStyles[layout];
	const titleId = `deal-history-title-${layout}`;

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area={`deal-history-${layout}`}
			{...style.section}
		>
			<Text as="h2" id={titleId} {...style.title}>
				{dealHistoryCopy.title}
			</Text>
			<DealChart
				layout={layout}
				deals={detail.deals}
				previousDeals={detail.previousDeals}
				endYear={rentDealBaseMonth.year}
			/>
			{detail.deals.length > 0 && (
				<BuildingDealList
					layout={layout}
					area={`deal-list-${layout}`}
					deals={detail.deals}
					label={dealHistoryCopy.currentDealsLabel}
					showsHeader={true}
					showsStatusBadges={true}
				/>
			)}
			{detail.previousDeals.length > 0 && (
				<PreviousBuildingDeals layout={layout} deals={detail.previousDeals} />
			)}
		</VStack>
	);
}

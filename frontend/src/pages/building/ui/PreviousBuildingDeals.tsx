import { Text, VStack } from "@seed-design/react";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import { previousBuildingDealsCopy } from "@/pages/building/config/previousBuildingDealsCopy";
import { previousBuildingDealsStyles } from "@/pages/building/config/previousBuildingDealsStyles";
import BuildingDealList from "@/pages/building/ui/BuildingDealList";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface PreviousBuildingDealsProps {
	layout: ResponsiveVariant;
	deals: BuildingDeal[];
}

/**
 * 건물 상세 > 이전 건물 거래 목록
 *
 * - 제목과 설명 아래에 이전 건물 거래 목록 출력
 * - 표 머리 행과 해제, 유사 건물 배지는 그리지 않음
 */
export default function PreviousBuildingDeals({
	layout,
	deals,
}: PreviousBuildingDealsProps) {
	const style = previousBuildingDealsStyles[layout];

	return (
		<VStack data-area={`previous-deals-${layout}`} {...style.block}>
			<VStack {...style.heading}>
				<Text as="h3" {...style.title}>
					{previousBuildingDealsCopy.title}
				</Text>
				<Text as="p" {...style.description}>
					{previousBuildingDealsCopy.description}
				</Text>
			</VStack>
			<BuildingDealList
				layout={layout}
				area={`previous-deal-list-${layout}`}
				deals={deals}
				label={previousBuildingDealsCopy.title}
				showsHeader={false}
				showsStatusBadges={false}
			/>
		</VStack>
	);
}

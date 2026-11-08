import { Box, Grid, Text, VStack } from "@seed-design/react";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import BuildingDealItem from "@/entities/building/ui/BuildingDealItem";
import BuildingDealRow from "@/entities/building/ui/BuildingDealRow";
import { buildingDealListStyles } from "@/pages/building/config/buildingDealListStyles";
import { dealHistoryColumns } from "@/pages/building/config/dealHistoryColumns";
import { dealHistoryCopy } from "@/pages/building/config/dealHistoryCopy";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface BuildingDealListProps {
	layout: ResponsiveVariant;
	deals: BuildingDeal[];
	label: string;
	showsHeader: boolean;
	showsStatusBadges: boolean;
}

/**
 * 건물 상세 > 거래 목록
 *
 * - 모바일은 거래마다 목록 항목 출력
 * - 데스크톱은 거래마다 표 행 출력하고, 머리 행은 보일 때만 출력
 * - React 키는 유형과 id를 함께 사용
 *
 * @param label 데스크톱 표의 이름
 * @param showsHeader 거짓이면 데스크톱 표의 머리 행을 그리지 않음
 * @param showsStatusBadges 거짓이면 해제와 유사 건물 배지를 그리지 않음
 */
export default function BuildingDealList({
	layout,
	deals,
	label,
	showsHeader,
	showsStatusBadges,
}: BuildingDealListProps) {
	const style = buildingDealListStyles;

	if (layout === "mobile") {
		return (
			<Box as="ul" {...style.list}>
				{deals.map((deal) => (
					<VStack as="li" key={`${deal.type}-${deal.id}`}>
						<BuildingDealItem
							deal={deal}
							showsStatusBadges={showsStatusBadges}
						/>
					</VStack>
				))}
			</Box>
		);
	}

	return (
		<Grid role="table" aria-label={label}>
			{showsHeader && (
				<Grid role="row" columns={dealHistoryColumns} {...style.headerRow}>
					<Box role="columnheader" {...style.headerCell}>
						<Text {...style.headerText}>
							{dealHistoryCopy.columns.contract}
						</Text>
					</Box>
					<Box role="columnheader" {...style.headerCell}>
						<Text {...style.headerText}>{dealHistoryCopy.columns.type}</Text>
					</Box>
					<Box role="columnheader" {...style.headerCell}>
						<Text {...style.headerText}>{dealHistoryCopy.columns.area}</Text>
					</Box>
					<Box role="columnheader" {...style.amountHeaderCell}>
						<Text {...style.headerText}>{dealHistoryCopy.columns.amount}</Text>
					</Box>
				</Grid>
			)}
			{deals.map((deal) => (
				<BuildingDealRow
					key={`${deal.type}-${deal.id}`}
					deal={deal}
					columns={dealHistoryColumns}
					showsStatusBadges={showsStatusBadges}
				/>
			))}
		</Grid>
	);
}

import { Box, Grid, Text, VStack } from "@seed-design/react";
import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";
import NearbyDealItem from "@/entities/building/ui/NearbyDealItem";
import NearbyDealRow from "@/entities/building/ui/NearbyDealRow";
import { nearbyDealColumns } from "@/pages/building/config/nearbyDealColumns";
import { nearbyDealListStyles } from "@/pages/building/config/nearbyDealListStyles";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealListProps {
	layout: ResponsiveVariant;
	deals: NearbyDeal[];
}

/**
 * 건물 상세 > 주변 거래 목록
 *
 * - 거래가 없으면 출력하지 않음
 * - 모바일은 거래마다 목록 항목 출력
 * - 데스크톱은 머리 행과 거래마다 표 행 출력
 * - React 키는 유형과 id를 함께 사용
 */
export default function NearbyDealList({ layout, deals }: NearbyDealListProps) {
	const style = nearbyDealListStyles;

	if (deals.length === 0) {
		return null;
	}

	if (layout === "mobile") {
		return (
			<Box as="ul" data-area="nearby-deal-list-mobile" {...style.list}>
				{deals.map((deal) => (
					<VStack as="li" key={`${deal.type}-${deal.id}`}>
						<NearbyDealItem deal={deal} />
					</VStack>
				))}
			</Box>
		);
	}

	return (
		<Grid
			role="table"
			aria-label={nearbyDealsCopy.title}
			data-area="nearby-deal-list-desktop"
		>
			<Grid role="row" columns={nearbyDealColumns} {...style.headerRow}>
				<Box role="columnheader" {...style.headerCell}>
					<Text {...style.headerText}>{nearbyDealsCopy.columns.building}</Text>
				</Box>
				<Box role="columnheader" {...style.headerCell}>
					<Text {...style.headerText}>{nearbyDealsCopy.columns.type}</Text>
				</Box>
				<Box role="columnheader" {...style.headerCell}>
					<Text {...style.headerText}>{nearbyDealsCopy.columns.contract}</Text>
				</Box>
				<Box role="columnheader" {...style.headerCell}>
					<Text {...style.headerText}>{nearbyDealsCopy.columns.area}</Text>
				</Box>
				<Box role="columnheader" {...style.amountHeaderCell}>
					<Text {...style.headerText}>{nearbyDealsCopy.columns.amount}</Text>
				</Box>
			</Grid>
			{deals.map((deal) => (
				<NearbyDealRow
					key={`${deal.type}-${deal.id}`}
					deal={deal}
					columns={nearbyDealColumns}
				/>
			))}
		</Grid>
	);
}

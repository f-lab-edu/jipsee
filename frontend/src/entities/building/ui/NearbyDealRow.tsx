import { Box, Grid, Text } from "@seed-design/react";
import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import { nearbyDealRowStyles } from "@/entities/building/config/nearbyDealRowStyles";
import { formatDealAmount } from "@/entities/building/lib/formatDealAmount";
import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";
import NearbyDealContractChip from "@/entities/building/ui/NearbyDealContractChip";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";

interface NearbyDealRowProps {
	deal: NearbyDeal;
	columns: string;
}

/**
 * 건물 > 주변 거래 표 행
 *
 * - 건물명, 계약 구분 칩, 계약 월, 전용면적, 금액 순서의 칸 출력
 * - 계약 구분이 없으면 칩 칸을 비워 두고 열 위치를 유지
 * - 건물명이 길면 한 줄로 줄이고 말줄임표를 붙임
 *
 * @param columns 머리 행과 같은 열 정의
 */
export default function NearbyDealRow({ deal, columns }: NearbyDealRowProps) {
	const style = nearbyDealRowStyles;

	return (
		<Grid role="row" columns={columns} {...style.row}>
			<Box role="cell" {...style.cell}>
				<Text {...style.name}>{deal.buildingName}</Text>
			</Box>
			<Box role="cell" {...style.cell}>
				<NearbyDealContractChip contract={deal.contract} layout="desktop" />
			</Box>
			<Box role="cell" {...style.cell}>
				<Text {...style.date}>{formatYearMonth(deal.month)}</Text>
			</Box>
			<Box role="cell" {...style.cell}>
				<Text {...style.area}>
					{`${deal.exclusiveArea}${buildingDealCopy.areaUnit}`}
				</Text>
			</Box>
			<Box role="cell" {...style.amountCell}>
				<Text {...style.amount}>
					{formatDealAmount(deal.type, deal.amount, deal.monthlyRent)}
				</Text>
			</Box>
		</Grid>
	);
}

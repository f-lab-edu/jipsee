import { Box, Grid, Text } from "@seed-design/react";
import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import { buildingDealRowStyles } from "@/entities/building/config/buildingDealRowStyles";
import { formatDealAmount } from "@/entities/building/lib/formatDealAmount";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import BuildingDealBadges from "@/entities/building/ui/BuildingDealBadges";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";

interface BuildingDealRowProps {
	deal: BuildingDeal;
	columns: string;
	showsStatusBadges: boolean;
}

/**
 * 건물 > 거래 표 행
 *
 * - 계약 월, 구분 배지, 전용면적, 금액 순서의 칸 출력
 * - 해제된 거래는 금액에 취소선을 긋고 색을 흐리게 함
 *
 * @param columns 머리 행과 같은 열 정의
 * @param showsStatusBadges 거짓이면 해제와 유사 건물 배지를 그리지 않음
 */
export default function BuildingDealRow({
	deal,
	columns,
	showsStatusBadges,
}: BuildingDealRowProps) {
	const style = buildingDealRowStyles;

	return (
		<Grid role="row" columns={columns} {...style.row}>
			<Box role="cell" {...style.cell}>
				<Text {...style.date}>{formatYearMonth(deal.month)}</Text>
			</Box>
			<Box role="cell" {...style.cell}>
				<BuildingDealBadges deal={deal} showsStatusBadges={showsStatusBadges} />
			</Box>
			<Box role="cell" {...style.cell}>
				<Text {...style.area}>
					{`${deal.exclusiveArea}${buildingDealCopy.areaUnit}`}
				</Text>
			</Box>
			<Box role="cell" {...style.amountCell}>
				<Text {...style.amount} {...(deal.cancelled && style.cancelledAmount)}>
					{formatDealAmount(deal.type, deal.amount, deal.monthlyRent)}
				</Text>
			</Box>
		</Grid>
	);
}

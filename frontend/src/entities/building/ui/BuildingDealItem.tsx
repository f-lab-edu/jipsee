import { Box, HStack, Text, VStack } from "@seed-design/react";
import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import { buildingDealItemStyles } from "@/entities/building/config/buildingDealItemStyles";
import { formatDealAmount } from "@/entities/building/lib/formatDealAmount";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";
import BuildingDealBadges from "@/entities/building/ui/BuildingDealBadges";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";

interface BuildingDealItemProps {
	deal: BuildingDeal;
	showsStatusBadges: boolean;
}

/**
 * 건물 > 거래 항목
 *
 * - 왼쪽에 배지 줄과 계약 월, 전용면적, 오른쪽에 금액 출력
 * - 해제된 거래는 금액에 취소선을 긋고 색을 흐리게 함
 *
 * @param showsStatusBadges 거짓이면 해제와 유사 건물 배지를 그리지 않음
 */
export default function BuildingDealItem({
	deal,
	showsStatusBadges,
}: BuildingDealItemProps) {
	const style = buildingDealItemStyles;

	return (
		<HStack {...style.item}>
			<VStack {...style.body}>
				<BuildingDealBadges deal={deal} showsStatusBadges={showsStatusBadges} />
				<HStack {...style.meta}>
					<Text {...style.metaText}>{formatYearMonth(deal.month)}</Text>
					<Text {...style.metaText}>
						{`${deal.exclusiveArea}${buildingDealCopy.areaUnit}`}
					</Text>
				</HStack>
			</VStack>
			<Box {...style.amountBox}>
				<Text {...style.amount} {...(deal.cancelled && style.cancelledAmount)}>
					{formatDealAmount(deal.type, deal.amount, deal.monthlyRent)}
				</Text>
			</Box>
		</HStack>
	);
}

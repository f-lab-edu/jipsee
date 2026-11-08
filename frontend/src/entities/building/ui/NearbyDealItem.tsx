import { Box, HStack, Text, VStack } from "@seed-design/react";
import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import { nearbyDealItemStyles } from "@/entities/building/config/nearbyDealItemStyles";
import { formatDealAmount } from "@/entities/building/lib/formatDealAmount";
import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";
import NearbyDealContractChip from "@/entities/building/ui/NearbyDealContractChip";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";

interface NearbyDealItemProps {
	deal: NearbyDeal;
}

/**
 * 건물 > 주변 거래 항목
 *
 * - 왼쪽에 건물명과 계약 구분 칩, 계약 월, 전용면적, 오른쪽에 금액 출력
 * - 모바일 목록 항목의 내용이며 계약 구분이 없으면 칩을 출력하지 않음
 * - 건물명이 길면 한 줄로 줄이고 말줄임표를 붙임
 */
export default function NearbyDealItem({ deal }: NearbyDealItemProps) {
	const style = nearbyDealItemStyles;

	return (
		<HStack {...style.item}>
			<VStack {...style.body}>
				<Text {...style.name}>{deal.buildingName}</Text>
				<HStack {...style.meta}>
					<NearbyDealContractChip contract={deal.contract} layout="mobile" />
					<Text {...style.metaText}>{formatYearMonth(deal.month)}</Text>
					<Text {...style.metaText}>
						{`${deal.exclusiveArea}${buildingDealCopy.areaUnit}`}
					</Text>
				</HStack>
			</VStack>
			<Box {...style.amountBox}>
				<Text {...style.amount}>
					{formatDealAmount(deal.type, deal.amount, deal.monthlyRent)}
				</Text>
			</Box>
		</HStack>
	);
}

import { Box, HStack, Text } from "@seed-design/react";
import { buildingDealBadgesStyles } from "@/entities/building/config/buildingDealBadgesStyles";
import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import { toDealLabel } from "@/entities/building/lib/toDealLabel";
import type { BuildingDeal } from "@/entities/building/model/buildingDeal";

interface BuildingDealBadgesProps {
	deal: BuildingDeal;
	showsStatusBadges: boolean;
}

/**
 * 건물 > 거래 배지
 *
 * - 거래 유형별 색으로 구분 배지 출력
 * - 해제와 유사 건물 배지는 상태 배지를 보일 때만 출력
 *
 * @param showsStatusBadges 거짓이면 해제와 유사 건물 배지를 그리지 않음
 */
export default function BuildingDealBadges({
	deal,
	showsStatusBadges,
}: BuildingDealBadgesProps) {
	const style = buildingDealBadgesStyles;
	const typeStyle = style.byType[deal.type];

	return (
		<HStack {...style.container}>
			<Box {...typeStyle.badge}>
				<Text {...style.typeLabel} {...typeStyle.label}>
					{toDealLabel(deal)}
				</Text>
			</Box>
			{showsStatusBadges && deal.cancelled && (
				<Box {...style.cancelled.badge}>
					<Text {...style.statusLabel} {...style.cancelled.label}>
						{buildingDealCopy.cancelled}
					</Text>
				</Box>
			)}
			{showsStatusBadges && deal.similarBuilding && (
				<Box {...style.similarBuilding.badge}>
					<Text {...style.statusLabel} {...style.similarBuilding.label}>
						{buildingDealCopy.similarBuilding}
					</Text>
				</Box>
			)}
		</HStack>
	);
}

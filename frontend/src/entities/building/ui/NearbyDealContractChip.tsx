import { Box, Text } from "@seed-design/react";
import { buildingDealCopy } from "@/entities/building/config/buildingDealCopy";
import { nearbyDealContractChipStyles } from "@/entities/building/config/nearbyDealContractChipStyles";
import type { NearbyDeal } from "@/entities/building/model/nearbyDeal";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealContractChipProps {
	contract: NearbyDeal["contract"];
	layout: ResponsiveVariant;
}

/**
 * 건물 > 주변 거래 계약 구분 칩
 *
 * - 신규는 "신규", 갱신은 "갱신" 출력
 * - 계약 구분이 없으면 출력하지 않음
 *
 * @param layout 글자 크기와 안쪽 여백, 둥글기를 정함
 */
export default function NearbyDealContractChip({
	contract,
	layout,
}: NearbyDealContractChipProps) {
	const style = nearbyDealContractChipStyles[layout];

	if (contract === null) {
		return null;
	}

	return (
		<Box {...style.chip}>
			<Text {...style.label}>{buildingDealCopy.contractLabels[contract]}</Text>
		</Box>
	);
}

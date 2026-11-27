import { VStack } from "@seed-design/react";
import { buildingAddressCopy } from "@/entities/building/config/buildingAddressCopy";
import { buildingAddressStyles } from "@/entities/building/config/buildingAddressStyles";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingAddressLine from "@/entities/building/ui/BuildingAddressLine";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface BuildingAddressProps {
	building: BuildingSummary;
	variant: ResponsiveVariant;
}

/**
 * 건물 > 주소
 *
 * - 건물명이 있으면 지번 줄 출력
 * - 건물명이 없으면 지번이 제목이므로 출력하지 않음
 */
export default function BuildingAddress({
	building,
	variant,
}: BuildingAddressProps) {
	const style = buildingAddressStyles[variant];

	if (building.name === null) {
		return null;
	}

	return (
		<VStack {...style.lines}>
			<BuildingAddressLine
				label={buildingAddressCopy.lot}
				address={building.lotAddress}
				style={style}
			/>
		</VStack>
	);
}

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
 * - 건물명이 있으면 지번 줄을 먼저, 도로명 주소가 있을 때만 도로명 줄을 다음에 출력
 * - 건물명이 없으면 지번이 제목이므로 도로명 줄만 출력
 * - 출력할 줄이 없으면 출력하지 않음
 */
export default function BuildingAddress({
	building,
	variant,
}: BuildingAddressProps) {
	const style = buildingAddressStyles[variant];
	const showsLot = building.name !== null;
	const showsRoad = building.roadAddress !== null;

	if (!showsLot && !showsRoad) {
		return null;
	}

	return (
		<VStack {...style.lines}>
			{showsLot && (
				<BuildingAddressLine
					label={buildingAddressCopy.lot}
					address={building.lotAddress}
					style={style}
				/>
			)}
			{building.roadAddress !== null && (
				<BuildingAddressLine
					label={buildingAddressCopy.road}
					address={building.roadAddress}
					style={style}
				/>
			)}
		</VStack>
	);
}

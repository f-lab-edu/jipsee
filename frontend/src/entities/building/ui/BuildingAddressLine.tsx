import { Box, HStack, Text } from "@seed-design/react";
import type { BuildingAddressStyle } from "@/entities/building/config/buildingAddressStyles";

interface BuildingAddressLineProps {
	label: string;
	address: string;
	style: BuildingAddressStyle;
}

/**
 * 건물 > 주소 한 줄
 *
 * - 작은 표시와 주소를 한 줄에 출력
 *
 * @param label 지번 표시
 */
export default function BuildingAddressLine({
	label,
	address,
	style,
}: BuildingAddressLineProps) {
	return (
		<HStack {...style.line}>
			<Box {...style.label}>
				<Text {...style.labelText}>{label}</Text>
			</Box>
			<Text {...style.text}>{address}</Text>
		</HStack>
	);
}

import { Text } from "@seed-design/react";
import { buildingAddressStyles } from "@/entities/building/config/buildingAddressStyles";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

interface BuildingAddressProps {
	building: BuildingSummary;
}

/**
 * 건물 > 주소
 *
 * - 건물명이 있을 때만 주소를 둘째 줄로 출력
 */
export default function BuildingAddress({ building }: BuildingAddressProps) {
	if (building.name === null) {
		return null;
	}

	return <Text {...buildingAddressStyles.text}>{building.address}</Text>;
}

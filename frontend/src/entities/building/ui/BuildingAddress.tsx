import { Text } from "@seed-design/react";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

interface BuildingAddressProps {
	building: BuildingSummary;
}

/** 건물명이 있을 때만 주소를 둘째 줄로 표시함 */
export default function BuildingAddress({ building }: BuildingAddressProps) {
	if (building.name === null) {
		return null;
	}

	return (
		<Text fontSize="t4" color="fg.neutralSubtle">
			{building.address}
		</Text>
	);
}

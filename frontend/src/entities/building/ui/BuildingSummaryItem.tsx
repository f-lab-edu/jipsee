import { Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { toBuildingDetail } from "@/entities/building/lib/toBuildingDetail";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingAddress from "@/entities/building/ui/BuildingAddress";
import { paths } from "@/shared/routes/paths";

interface BuildingSummaryItemProps {
	building: BuildingSummary;
}

/**
 * 건물 > 요약 링크
 *
 * - 건물명, 주소, 상세 정보 출력
 * - 건물명이 없으면 주소로 대체
 */
export default function BuildingSummaryItem({
	building,
}: BuildingSummaryItemProps) {
	return (
		<Link href={paths.building(building.id)}>
			<VStack gap="x1" px="spacingX.globalGutter" py="x3">
				<Text fontSize="t5" fontWeight="bold">
					{building.name ?? building.address}
				</Text>
				<BuildingAddress building={building} />
				<Text fontSize="t3" color="fg.neutralSubtle">
					{toBuildingDetail(building)}
				</Text>
			</VStack>
		</Link>
	);
}

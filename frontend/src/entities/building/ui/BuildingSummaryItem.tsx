import { Box, Flex, Icon, Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { buildingSummaryItemStyles } from "@/entities/building/config/buildingSummaryItemStyles";
import { toBuildingSummaryDetail } from "@/entities/building/lib/toBuildingSummaryDetail";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingAddress from "@/entities/building/ui/BuildingAddress";
import BuildingChevronIcon from "@/entities/building/ui/BuildingChevronIcon";
import { paths } from "@/shared/routes/paths";

interface BuildingSummaryItemProps {
	building: BuildingSummary;
}

/**
 * 건물 > 요약 링크
 *
 * - 건물명, 주소, 상세 정보와 오른쪽 화살표 출력
 * - 건물명이 없으면 주소로 대체
 */
export default function BuildingSummaryItem({
	building,
}: BuildingSummaryItemProps) {
	const style = buildingSummaryItemStyles;

	return (
		<Link href={paths.building(building.id)}>
			<Flex {...style.row}>
				<VStack {...style.body}>
					<Text {...style.name}>{building.name ?? building.address}</Text>
					<BuildingAddress building={building} />
					<Box {...style.detailCell}>
						<Text {...style.detail}>{toBuildingSummaryDetail(building)}</Text>
					</Box>
				</VStack>
				<Box {...style.chevronCell}>
					<Icon svg={<BuildingChevronIcon />} {...style.chevron} />
				</Box>
			</Flex>
		</Link>
	);
}

import { Box, Flex, Icon, Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { buildingSummaryItemStyles } from "@/entities/building/config/buildingSummaryItemStyles";
import { toBuildingSummaryDetail } from "@/entities/building/lib/toBuildingSummaryDetail";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingAddress from "@/entities/building/ui/BuildingAddress";
import { paths } from "@/shared/routes/paths";
import ChevronRightIcon from "@/shared/ui/ChevronRightIcon";

interface BuildingSummaryItemProps {
	building: BuildingSummary;
}

/**
 * 건물 > 요약 링크
 *
 * - 건물명, 주소, 상세 정보와 오른쪽 화살표 출력
 * - 건물명이 없으면 지번 주소로 대체
 */
export default function BuildingSummaryItem({
	building,
}: BuildingSummaryItemProps) {
	const style = buildingSummaryItemStyles;

	return (
		<Link href={paths.building(building.id)}>
			<Flex {...style.row}>
				<VStack {...style.body}>
					<Text {...style.name}>{building.name ?? building.lotAddress}</Text>
					<BuildingAddress building={building} variant="mobile" />
					<Box {...style.detailCell}>
						<Text {...style.detail}>{toBuildingSummaryDetail(building)}</Text>
					</Box>
				</VStack>
				<Box {...style.chevronCell}>
					<Icon svg={<ChevronRightIcon />} {...style.chevron} />
				</Box>
			</Flex>
		</Link>
	);
}

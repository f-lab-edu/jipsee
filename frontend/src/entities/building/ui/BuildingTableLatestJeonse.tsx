import { Box, Text } from "@seed-design/react";
import { buildingTableRowCopy } from "@/entities/building/config/buildingTableRowCopy";
import { buildingTableRowStyles } from "@/entities/building/config/buildingTableRowStyles";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";

interface BuildingTableLatestJeonseProps {
	building: BuildingSummary;
}

/**
 * 건물 > 표 최근 신규 전세
 *
 * - 최근 신규 전세 월이 있으면 연월 출력
 * - 없으면 최근 12개월 없음 배지 출력
 */
export default function BuildingTableLatestJeonse({
	building,
}: BuildingTableLatestJeonseProps) {
	const style = buildingTableRowStyles;

	if (building.latestNewJeonseMonth === null) {
		return (
			<Box {...style.badge}>
				<Text {...style.badgeText}>{buildingTableRowCopy.noLatestJeonse}</Text>
			</Box>
		);
	}

	return (
		<Text {...style.latestDate}>
			{formatYearMonth(building.latestNewJeonseMonth)}
		</Text>
	);
}

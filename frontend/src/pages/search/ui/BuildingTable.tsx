import { Box, Grid, Text } from "@seed-design/react";
import type { ReactNode } from "react";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingTableRow from "@/entities/building/ui/BuildingTableRow";
import { buildingTableColumns } from "@/pages/search/config/buildingTableColumns";
import { buildingTableCopy } from "@/pages/search/config/buildingTableCopy";
import { buildingTableStyles } from "@/pages/search/config/buildingTableStyles";

interface BuildingTableProps {
	buildings: BuildingSummary[];
	children?: ReactNode;
}

/**
 * 검색 > 건물 표
 *
 * - 머리 행에 건물, 최근 신규 전세 열 이름 출력
 * - 마지막 열은 화면에 보이는 문구 없이 상세로 이름만 지정
 * - 건물마다 한 행 출력
 * - children이 있으면 표 아래에 출력
 */
export default function BuildingTable({
	buildings,
	children,
}: BuildingTableProps) {
	const style = buildingTableStyles;

	return (
		<Box {...style.panel}>
			<Grid role="table" aria-label={buildingTableCopy.label}>
				<Grid role="row" columns={buildingTableColumns} {...style.headerRow}>
					<Box role="columnheader" {...style.buildingHeaderCell}>
						<Text {...style.headerText}>{buildingTableCopy.building}</Text>
					</Box>
					<Box role="columnheader" {...style.headerCell}>
						<Text {...style.headerText}>
							{buildingTableCopy.latestNewJeonse}
						</Text>
					</Box>
					<Box
						role="columnheader"
						aria-label={buildingTableCopy.detail}
						{...style.detailHeaderCell}
					/>
				</Grid>
				{buildings.map((building) => (
					<BuildingTableRow
						key={building.id}
						building={building}
						columns={buildingTableColumns}
					/>
				))}
			</Grid>
			{children}
		</Box>
	);
}

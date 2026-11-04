import { Box, Grid, Icon, Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { buildingTableRowCopy } from "@/entities/building/config/buildingTableRowCopy";
import { buildingTableRowStyles } from "@/entities/building/config/buildingTableRowStyles";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingAddress from "@/entities/building/ui/BuildingAddress";
import BuildingChevronIcon from "@/entities/building/ui/BuildingChevronIcon";
import BuildingTableLatestJeonse from "@/entities/building/ui/BuildingTableLatestJeonse";
import { paths } from "@/shared/routes/paths";

interface BuildingTableRowProps {
	building: BuildingSummary;
	columns: string;
}

/**
 * 건물 > 표 행
 *
 * - 건물 칸에 건물 상세 링크 출력, 건물명이 없으면 주소로 대체
 * - 사용승인 연도가 없으면 사용승인 칸을 비워 둠
 * - 건물 칸 링크의 누르는 영역을 행 전체로 넓힘
 * - 화살표 링크 이름은 건물명 뒤에 상세를 붙임
 *
 * @param columns 머리 행과 같은 열 정의
 */
export default function BuildingTableRow({
	building,
	columns,
}: BuildingTableRowProps) {
	const style = buildingTableRowStyles;
	const title = building.name ?? building.address;

	return (
		<Grid role="row" columns={columns} {...style.row}>
			<Box role="cell" {...style.buildingCell}>
				<VStack asChild {...style.link}>
					<Link href={paths.building(building.id)}>
						<Text {...style.name}>{title}</Text>
						<BuildingAddress building={building} />
					</Link>
				</VStack>
			</Box>
			<Box role="cell" {...style.useApprovalCell}>
				{building.useApprovalYear !== null && (
					<Text {...style.useApproval}>{building.useApprovalYear}년</Text>
				)}
			</Box>
			<Box role="cell" {...style.latestCell}>
				<BuildingTableLatestJeonse building={building} />
			</Box>
			<Box role="cell" {...style.chevronCell}>
				<Box asChild {...style.chevronLink}>
					<Link
						href={paths.building(building.id)}
						aria-label={`${title} ${buildingTableRowCopy.detail}`}
					>
						<Icon svg={<BuildingChevronIcon />} {...style.chevron} />
					</Link>
				</Box>
			</Box>
		</Grid>
	);
}

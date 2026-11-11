import { Grid, Text, VStack } from "@seed-design/react";
import { dongInfoCardStyles } from "@/entities/building/config/dongInfoCardStyles";
import { toDongInfoRows } from "@/entities/building/lib/toDongInfoRows";
import type { BuildingDong } from "@/entities/building/model/buildingDong";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DongInfoCardProps {
	dong: BuildingDong;
	layout: ResponsiveVariant;
	area: string;
}

/**
 * 건물 > 동 정보 카드
 *
 * - 동 이름이 있을 때만 제목 출력
 * - 항목을 두 열 목록으로 출력하고, 두 열을 차지하는 항목은 한 줄 전체를 씀
 *
 * @param layout 동 이름 글자 크기가 모바일 16, 데스크톱 15로 다름
 */
export default function DongInfoCard({
	dong,
	layout,
	area,
}: DongInfoCardProps) {
	const style = dongInfoCardStyles[layout];
	const rows = toDongInfoRows(dong);

	return (
		<VStack data-area={area} {...style.card}>
			{dong.name !== null && (
				<Text as="h3" {...style.title}>
					{dong.name}
				</Text>
			)}
			<Grid as="dl" columns={2} {...style.list}>
				{rows.map((row) => (
					<VStack
						key={row.label}
						{...style.item}
						{...(row.spansTwoColumns && style.wideItem)}
					>
						<Text as="dt" {...style.label}>
							{row.label}
						</Text>
						<Text as="dd" {...style.value}>
							{row.value}
						</Text>
					</VStack>
				))}
			</Grid>
		</VStack>
	);
}

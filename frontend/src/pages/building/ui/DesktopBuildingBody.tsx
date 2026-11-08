import { Grid, GridItem, VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import { desktopBuildingBodyStyles } from "@/pages/building/config/desktopBuildingBodyStyles";
import BuildingInfoSection from "@/pages/building/ui/BuildingInfoSection";
import BuildingTitleRow from "@/pages/building/ui/BuildingTitleRow";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import ContentContainer from "@/shared/ui/ContentContainer";

interface DesktopBuildingBodyProps {
	detail: BuildingDetail;
	registerBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 데스크톱 본문
 *
 * - 콘텐츠 컨테이너 안에 제목 줄과 본문 열, 380 폭 aside 열 출력
 * - 본문 열은 아직 비어 있음
 * - aside는 위 24에 붙어 따라오고 뷰포트보다 길면 안에서 스크롤
 */
export default function DesktopBuildingBody({
	detail,
	registerBaseMonth,
}: DesktopBuildingBodyProps) {
	const style = desktopBuildingBodyStyles;

	return (
		<ContentContainer>
			<VStack {...style.container}>
				<BuildingTitleRow name={detail.name} address={detail.address} />
				<Grid {...style.grid}>
					<GridItem {...style.mainCell} />
					<GridItem as="aside" {...style.asideCell}>
						<VStack {...style.aside}>
							<BuildingInfoSection
								layout="desktop"
								detail={detail}
								registerBaseMonth={registerBaseMonth}
							/>
						</VStack>
					</GridItem>
				</Grid>
			</VStack>
		</ContentContainer>
	);
}

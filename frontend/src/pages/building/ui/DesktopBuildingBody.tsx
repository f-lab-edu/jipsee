import { Grid, GridItem, VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import { desktopBuildingBodyStyles } from "@/pages/building/config/desktopBuildingBodyStyles";
import BuildingInfoSection from "@/pages/building/ui/BuildingInfoSection";
import BuildingTitleRow from "@/pages/building/ui/BuildingTitleRow";
import DealHistorySection from "@/pages/building/ui/DealHistorySection";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import ContentContainer from "@/shared/ui/ContentContainer";

interface DesktopBuildingBodyProps {
	detail: BuildingDetail;
	registerBaseMonth: YearMonth;
	rentDealBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 데스크톱 본문
 *
 * - 콘텐츠 컨테이너 안에 제목 줄과 본문 열, 380 폭 aside 열 출력
 * - 본문 열에 거래 이력 영역 출력
 * - aside는 위 24에 붙어 따라오고 뷰포트보다 길면 안에서 스크롤
 */
export default function DesktopBuildingBody({
	detail,
	registerBaseMonth,
	rentDealBaseMonth,
}: DesktopBuildingBodyProps) {
	const style = desktopBuildingBodyStyles;

	return (
		<ContentContainer>
			<VStack {...style.container}>
				<BuildingTitleRow name={detail.name} address={detail.address} />
				<Grid {...style.grid}>
					<GridItem {...style.mainCell}>
						<DealHistorySection
							layout="desktop"
							detail={detail}
							rentDealBaseMonth={rentDealBaseMonth}
						/>
					</GridItem>
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

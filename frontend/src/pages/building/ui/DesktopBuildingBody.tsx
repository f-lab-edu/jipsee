import { Grid, GridItem, VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import type { Session } from "@/entities/session/model/session";
import AskBuildingCard from "@/features/askChatbot/ui/AskBuildingCard";
import { desktopBuildingBodyStyles } from "@/pages/building/config/desktopBuildingBodyStyles";
import BuildingInfoSection from "@/pages/building/ui/BuildingInfoSection";
import BuildingTitleRow from "@/pages/building/ui/BuildingTitleRow";
import DealHistorySection from "@/pages/building/ui/DealHistorySection";
import NearbyDealsSection from "@/pages/building/ui/NearbyDealsSection";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ContentContainer from "@/shared/ui/ContentContainer";

interface DesktopBuildingBodyProps {
	detail: BuildingDetail;
	condition: NearbyDealsCondition;
	nearby: NearbyDealsResult;
	registerBaseMonth: YearMonth;
	rentDealBaseMonth: YearMonth;
	session: Nullable<Session>;
}

/**
 * 건물 상세 > 데스크톱 본문
 *
 * - 콘텐츠 컨테이너 안에 제목 줄과 본문 열, 380 폭 aside 열 출력
 * - 본문 열에 거래 이력 영역, 주변 거래 영역 순서로 출력
 * - aside에 질문하기 카드, 건물 정보 영역 순서로 출력
 * - aside는 위 24에 붙어 따라오고 뷰포트보다 길면 안에서 스크롤
 */
export default function DesktopBuildingBody({
	detail,
	condition,
	nearby,
	registerBaseMonth,
	rentDealBaseMonth,
	session,
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
						<NearbyDealsSection
							layout="desktop"
							buildingId={detail.id}
							condition={condition}
							result={nearby}
							rentDealBaseMonth={rentDealBaseMonth}
						/>
					</GridItem>
					<GridItem as="aside" {...style.asideCell}>
						<VStack {...style.aside}>
							<AskBuildingCard buildingId={detail.id} session={session} />
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

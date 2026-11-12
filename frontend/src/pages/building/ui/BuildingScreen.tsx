import { VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import type { Session } from "@/entities/session/model/session";
import AskBuildingBar from "@/features/askChatbot/ui/AskBuildingBar";
import { toNearbyFilterHref } from "@/features/filterNearbyDeals/lib/toNearbyFilterHref";
import { buildingScreenStyles } from "@/pages/building/config/buildingScreenStyles";
import DesktopBuildingBody from "@/pages/building/ui/DesktopBuildingBody";
import MobileBuildingBody from "@/pages/building/ui/MobileBuildingBody";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";
import Footer from "@/widgets/footer/ui/Footer";
import BuildingHeader from "@/widgets/header/ui/BuildingHeader";

interface BuildingScreenProps {
	detail: BuildingDetail;
	condition: NearbyDealsCondition;
	nearby: NearbyDealsResult;
	registerBaseMonth: YearMonth;
	rentDealBaseMonth: YearMonth;
	session: Nullable<Session>;
}

/**
 * 건물 상세 > 화면 뼈대
 *
 * - 1280 미만은 한 열로 두고, md 이상에서 열 폭을 720까지 넓힘
 * - 헤더, 본문, 푸터, 모바일 질문 바 순서로 열 안에 출력
 * - 열 바깥의 마지막 자식으로 하단 내비게이션 출력
 * - 주변 거래 조건과 결과를 모바일, 데스크톱 본문에 전달
 */
export default function BuildingScreen({
	detail,
	condition,
	nearby,
	registerBaseMonth,
	rentDealBaseMonth,
	session,
}: BuildingScreenProps) {
	const style = buildingScreenStyles;

	return (
		<VStack {...style.page}>
			<VStack {...style.column}>
				<BuildingHeader
					session={session}
					currentPath={toNearbyFilterHref(detail.id, condition, {})}
				/>
				<VStack as="main" data-area="main" {...style.main}>
					<ResponsiveLayout
						testId="building-body"
						mobile={
							<MobileBuildingBody
								detail={detail}
								condition={condition}
								nearby={nearby}
								registerBaseMonth={registerBaseMonth}
								rentDealBaseMonth={rentDealBaseMonth}
							/>
						}
						desktop={
							<DesktopBuildingBody
								detail={detail}
								condition={condition}
								nearby={nearby}
								registerBaseMonth={registerBaseMonth}
								rentDealBaseMonth={rentDealBaseMonth}
								session={session}
							/>
						}
					/>
				</VStack>
				<Footer />
				<AskBuildingBar buildingId={detail.id} session={session} />
			</VStack>
			<BottomNav session={session} />
		</VStack>
	);
}

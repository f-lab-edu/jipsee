import { VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import type { Session } from "@/entities/session/model/session";
import { toNearbyFilterHref } from "@/features/filterNearbyDeals/lib/toNearbyFilterHref";
import { buildingScreenStyles } from "@/pages/building/config/buildingScreenStyles";
import DesktopBuildingBody from "@/pages/building/ui/DesktopBuildingBody";
import MobileBuildingBody from "@/pages/building/ui/MobileBuildingBody";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import PageColumn from "@/shared/ui/PageColumn";
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
 * - 헤더, 본문, 푸터 순서로 열 안에 출력
 * - 1280 미만에서 열은 흰색이고, 열의 마지막 자식으로 하단 내비게이션 출력
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
		<PageColumn>
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
						/>
					}
				/>
			</VStack>
			<Footer />
			<BottomNav session={session} />
		</PageColumn>
	);
}

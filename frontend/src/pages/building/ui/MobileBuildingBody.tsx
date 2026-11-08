import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import BuildingInfoSection from "@/pages/building/ui/BuildingInfoSection";
import DealHistorySection from "@/pages/building/ui/DealHistorySection";
import NearbyDealsSection from "@/pages/building/ui/NearbyDealsSection";
import SectionDivider from "@/pages/building/ui/SectionDivider";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";

interface MobileBuildingBodyProps {
	detail: BuildingDetail;
	condition: NearbyDealsCondition;
	nearby: NearbyDealsResult;
	registerBaseMonth: YearMonth;
	rentDealBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 모바일 본문
 *
 * - 건물 정보 영역, 구분 띠, 거래 이력 영역, 구분 띠, 주변 거래 영역 순서로 출력
 */
export default function MobileBuildingBody({
	detail,
	condition,
	nearby,
	registerBaseMonth,
	rentDealBaseMonth,
}: MobileBuildingBodyProps) {
	return (
		<>
			<BuildingInfoSection
				layout="mobile"
				detail={detail}
				registerBaseMonth={registerBaseMonth}
			/>
			<SectionDivider />
			<DealHistorySection
				layout="mobile"
				detail={detail}
				rentDealBaseMonth={rentDealBaseMonth}
			/>
			<SectionDivider />
			<NearbyDealsSection
				layout="mobile"
				buildingId={detail.id}
				condition={condition}
				result={nearby}
				rentDealBaseMonth={rentDealBaseMonth}
			/>
		</>
	);
}

import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import type { NearbyDealsResult } from "@/entities/building/model/nearbyDealsResult";
import BuildingInfoSection from "@/pages/building/ui/BuildingInfoSection";
import DealHistorySection from "@/pages/building/ui/DealHistorySection";
import MobileBuildingTitle from "@/pages/building/ui/MobileBuildingTitle";
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
 * - 건물명 제목, 건물 정보 영역, 구분 띠, 거래 이력 영역, 구분 띠, 주변 거래 영역 순서로 출력
 * - 카드 모양은 main이 정하므로 감싸는 요소 없이 출력
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
			<MobileBuildingTitle name={detail.name} address={detail.address} />
			<BuildingInfoSection
				layout="mobile"
				detail={detail}
				registerBaseMonth={registerBaseMonth}
			/>
			<SectionDivider area="section-divider-history" />
			<DealHistorySection
				layout="mobile"
				detail={detail}
				rentDealBaseMonth={rentDealBaseMonth}
			/>
			<SectionDivider area="section-divider-nearby" />
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

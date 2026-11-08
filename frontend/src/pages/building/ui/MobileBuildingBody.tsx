import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import BuildingInfoSection from "@/pages/building/ui/BuildingInfoSection";
import DealHistorySection from "@/pages/building/ui/DealHistorySection";
import SectionDivider from "@/pages/building/ui/SectionDivider";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";

interface MobileBuildingBodyProps {
	detail: BuildingDetail;
	registerBaseMonth: YearMonth;
	rentDealBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 모바일 본문
 *
 * - 건물 정보 영역, 구분 띠, 거래 이력 영역 순서로 출력
 */
export default function MobileBuildingBody({
	detail,
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
		</>
	);
}

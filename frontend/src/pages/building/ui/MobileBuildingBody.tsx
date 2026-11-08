import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import BuildingInfoSection from "@/pages/building/ui/BuildingInfoSection";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";

interface MobileBuildingBodyProps {
	detail: BuildingDetail;
	registerBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 모바일 본문
 *
 * - 건물 정보 영역만 출력
 */
export default function MobileBuildingBody({
	detail,
	registerBaseMonth,
}: MobileBuildingBodyProps) {
	return (
		<BuildingInfoSection
			layout="mobile"
			detail={detail}
			registerBaseMonth={registerBaseMonth}
		/>
	);
}

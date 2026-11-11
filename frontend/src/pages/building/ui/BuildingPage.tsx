import { notFound } from "next/navigation";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";
import { getNearbyDeals } from "@/entities/building/api/getNearbyDeals";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import { getBuildingRegisterBaseMonth } from "@/entities/dataSource/api/getBuildingRegisterBaseMonth";
import { getRentDealBaseMonth } from "@/entities/dataSource/api/getRentDealBaseMonth";
import type { Session } from "@/entities/session/model/session";
import BuildingScreen from "@/pages/building/ui/BuildingScreen";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface BuildingPageProps {
	buildingId: number;
	condition: NearbyDealsCondition;
	session: Nullable<Session>;
}

/**
 * 건물 상세 > 페이지
 *
 * - 건물 상세와 건축물대장 기준 월, 실거래 기준 월, 조건에 맞는 주변 거래를 함께 조회
 * - 건물이 없으면 404
 * - 있으면 건물 상세 화면 출력
 */
export default async function BuildingPage({
	buildingId,
	condition,
	session,
}: BuildingPageProps) {
	const [detail, registerBaseMonth, rentDealBaseMonth, nearby] =
		await Promise.all([
			getBuildingDetail(buildingId),
			getBuildingRegisterBaseMonth(),
			getRentDealBaseMonth(),
			getNearbyDeals(buildingId, condition),
		]);

	if (detail === null) {
		notFound();
	}

	return (
		<BuildingScreen
			detail={detail}
			condition={condition}
			nearby={nearby}
			registerBaseMonth={registerBaseMonth}
			rentDealBaseMonth={rentDealBaseMonth}
			session={session}
		/>
	);
}

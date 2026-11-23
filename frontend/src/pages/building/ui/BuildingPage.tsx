import { notFound } from "next/navigation";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";
import { getNearbyDeals } from "@/entities/building/api/getNearbyDeals";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import { getRentDealBaseMonth } from "@/entities/dataSource/api/getRentDealBaseMonth";
import type { Session } from "@/entities/session/model/session";
import BuildingScreen from "@/pages/building/ui/BuildingScreen";
import BuildingStatusScreen from "@/pages/building/ui/BuildingStatusScreen";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface BuildingPageProps {
	buildingId: string;
	condition: NearbyDealsCondition;
	session: Nullable<Session>;
}

/**
 * 건물 상세 > 페이지
 *
 * - 건물 상세와 실거래 기준 월, 조건에 맞는 주변 거래를 함께 조회
 * - 건물이 없으면 404
 * - 요청 제한이면 본문만 요청 제한 안내로 바꾼 화면 출력
 * - 있으면 건물 상세 화면 출력
 */
export default async function BuildingPage({
	buildingId,
	condition,
	session,
}: BuildingPageProps) {
	const [detailResult, rentDealBaseMonth, nearby] = await Promise.all([
		getBuildingDetail(buildingId),
		getRentDealBaseMonth(),
		getNearbyDeals(buildingId, condition),
	]);

	if (detailResult.kind === "notFound") {
		notFound();
	}

	if (detailResult.kind === "rateLimited") {
		return <BuildingStatusScreen buildingId={buildingId} session={session} />;
	}

	return (
		<BuildingScreen
			detail={detailResult.detail}
			condition={condition}
			nearby={nearby}
			rentDealBaseMonth={rentDealBaseMonth}
			session={session}
		/>
	);
}

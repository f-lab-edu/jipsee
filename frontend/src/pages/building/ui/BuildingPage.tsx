import { notFound } from "next/navigation";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";
import { getBuildingRegisterBaseMonth } from "@/entities/dataSource/api/getBuildingRegisterBaseMonth";
import { getRentDealBaseMonth } from "@/entities/dataSource/api/getRentDealBaseMonth";
import type { Session } from "@/entities/session/model/session";
import BuildingScreen from "@/pages/building/ui/BuildingScreen";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface BuildingPageProps {
	buildingId: number;
	session: Nullable<Session>;
}

/**
 * 건물 상세 > 페이지
 *
 * - 건물 상세와 건축물대장 기준 월, 실거래 기준 월을 함께 조회
 * - 건물이 없으면 404
 * - 있으면 건물 상세 화면 출력
 */
export default async function BuildingPage({
	buildingId,
	session,
}: BuildingPageProps) {
	const [detail, registerBaseMonth, rentDealBaseMonth] = await Promise.all([
		getBuildingDetail(buildingId),
		getBuildingRegisterBaseMonth(),
		getRentDealBaseMonth(),
	]);

	if (detail === null) {
		notFound();
	}

	return (
		<BuildingScreen
			detail={detail}
			registerBaseMonth={registerBaseMonth}
			rentDealBaseMonth={rentDealBaseMonth}
			session={session}
		/>
	);
}

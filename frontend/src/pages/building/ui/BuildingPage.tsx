import { notFound } from "next/navigation";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";
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
 * - 건물 상세 조회
 * - 건물이 없으면 404
 * - 있으면 건물 상세 화면 출력
 */
export default async function BuildingPage({
	buildingId,
	session,
}: BuildingPageProps) {
	const detail = await getBuildingDetail(buildingId);

	if (detail === null) {
		notFound();
	}

	return <BuildingScreen detail={detail} session={session} />;
}

import { notFound } from "next/navigation";
import { getSession } from "@/entities/session/api/getSession";
import { toBuildingId } from "@/pages/building/lib/toBuildingId";
import BuildingPage from "@/pages/building/ui/BuildingPage";

/**
 * 건물 상세 > 페이지
 *
 * - id 파라미터를 건물 id로 변환
 * - 양의 정수가 아니면 404
 * - 건물 id가 있으면 세션 조회 후 건물 상세 페이지에 전달
 */
export default async function Page({ params }: PageProps<"/buildings/[id]">) {
	const { id } = await params;
	const buildingId = toBuildingId(id);

	if (buildingId === null) {
		notFound();
	}

	const session = await getSession();

	return <BuildingPage buildingId={buildingId} session={session} />;
}

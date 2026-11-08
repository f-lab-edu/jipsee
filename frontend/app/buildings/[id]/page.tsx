import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";
import { getSession } from "@/entities/session/api/getSession";
import { toBuildingId } from "@/pages/building/lib/toBuildingId";
import { toBuildingTitle } from "@/pages/building/lib/toBuildingTitle";
import { toNearbyCondition } from "@/pages/building/lib/toNearbyCondition";
import BuildingPage from "@/pages/building/ui/BuildingPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";

/**
 * 건물 상세 > 메타데이터
 *
 * - id가 양의 정수가 아니거나 건물이 없으면 빈 메타데이터 반환
 * - 있으면 건물 이름 또는 주소로 제목 생성
 */
export async function generateMetadata(
	{ params }: PageProps<"/buildings/[id]">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { id } = await params;
	const buildingId = toBuildingId(id);

	if (buildingId === null) {
		return {};
	}

	const detail = await getBuildingDetail(buildingId);

	if (detail === null) {
		return {};
	}

	return toPageMetadata(toBuildingTitle(detail), parent);
}

/**
 * 건물 상세 > 페이지
 *
 * - id 파라미터를 건물 id로 변환
 * - 양의 정수가 아니면 404
 * - 쿼리를 주변 거래 조건으로 변환
 * - 건물 id가 있으면 세션 조회 후 조건과 함께 건물 상세 페이지에 전달
 */
export default async function Page({
	params,
	searchParams,
}: PageProps<"/buildings/[id]">) {
	const { id } = await params;
	const buildingId = toBuildingId(id);

	if (buildingId === null) {
		notFound();
	}

	const condition = toNearbyCondition(await searchParams);
	const session = await getSession();

	return (
		<BuildingPage
			buildingId={buildingId}
			condition={condition}
			session={session}
		/>
	);
}

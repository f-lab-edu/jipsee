import type { Metadata, ResolvingMetadata } from "next";
import { getBuildingDetail } from "@/entities/building/api/getBuildingDetail";
import { getSession } from "@/entities/session/api/getSession";
import { toBuildingTitle } from "@/pages/building/lib/toBuildingTitle";
import { toNearbyCondition } from "@/pages/building/lib/toNearbyCondition";
import BuildingPage from "@/pages/building/ui/BuildingPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 건물 상세 > 메타데이터
 *
 * - id 파라미터를 디코딩해 조회하고 건물이 없거나 요청 제한이면 빈 메타데이터 반환
 * - 있으면 건물 이름 또는 주소로 제목 생성
 */
export async function generateMetadata(
	{ params }: PageProps<"/buildings/[id]">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const id = decodeURIComponent((await params).id);
	const result = await getBuildingDetail(id);

	if (result.kind !== "found") {
		return {};
	}

	return toPageMetadata(
		toBuildingTitle(result.detail),
		parent,
		paths.building(id),
	);
}

/**
 * 건물 상세 > 페이지
 *
 * - id 파라미터는 URL 인코딩된 채로 전달되므로 디코딩해 건물 id로 사용
 * - 쿼리를 주변 거래 조건으로 변환
 * - 세션 조회 후 조건과 함께 건물 상세 페이지에 전달
 */
export default async function Page({
	params,
	searchParams,
}: PageProps<"/buildings/[id]">) {
	const id = decodeURIComponent((await params).id);
	const condition = toNearbyCondition(await searchParams);
	const session = await getSession();

	return (
		<BuildingPage buildingId={id} condition={condition} session={session} />
	);
}

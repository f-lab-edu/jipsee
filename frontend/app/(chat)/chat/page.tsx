import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getChatBuilding } from "@/entities/chat/api/getChatBuilding";
import { getChatLimit } from "@/entities/chat/api/getChatLimit";
import { getSession } from "@/entities/session/api/getSession";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { toChatPath } from "@/pages/chat/lib/toChatPath";
import { toPositiveId } from "@/pages/chat/lib/toPositiveId";
import ChatPage from "@/pages/chat/ui/ChatPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

/**
 * 집사 > 메타데이터
 *
 * - 제목을 집사로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/chat">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata(chatCopy.title, parent);
}

/**
 * 집사 > 새 대화 페이지
 *
 * - 로그인하지 않은 상태면 돌아올 경로(buildingId 쿼리 포함)를 담아 로그인으로 이동
 * - buildingId가 있으면 건물을 조회하고 양의 정수가 아니거나 없는 건물이면 404
 * - 한도 소진 여부를 조회해 페이지에 전달
 */
export default async function Page({ searchParams }: PageProps<"/chat">) {
	const { buildingId: rawBuildingId } = await searchParams;
	const session = await getSession();

	if (!session) {
		redirect(paths.loginWithNext(toChatPath(rawBuildingId)));
	}

	let buildingId: Nullable<number> = null;
	let buildingName: Nullable<string> = null;

	if (rawBuildingId !== undefined) {
		buildingId = toPositiveId(rawBuildingId);

		if (buildingId === null) {
			notFound();
		}

		const building = await getChatBuilding(buildingId);

		if (building === null) {
			notFound();
		}

		buildingName = building.name;
	}

	const { dailyLimitReached } = await getChatLimit();

	return (
		<ChatPage
			session={session}
			currentPath={toChatPath(rawBuildingId)}
			chatId={null}
			buildingId={buildingId}
			buildingName={buildingName}
			initialMessages={[]}
			isLimitReached={dailyLimitReached}
		/>
	);
}

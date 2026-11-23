import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getChatBuilding } from "@/entities/chat/api/getChatBuilding";
import { getChatLimit } from "@/entities/chat/api/getChatLimit";
import { getChatList } from "@/entities/chat/api/getChatList";
import { getSession } from "@/entities/session/api/getSession";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { toChatPath } from "@/pages/chat/lib/toChatPath";
import ChatPage from "@/pages/chat/ui/ChatPage";
import { toFormError } from "@/shared/lib/formError/toFormError";
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
 * - buildingId가 있으면 건물을 조회하고 없는 건물이면 404
 * - 세션과 쿼리, 건물과 한도 소진 여부와 대화 목록은 서로 기다리지 않고 함께 조회해 페이지에 전달
 * - error 쿼리가 대화 삭제 실패 코드이면 실패 안내용으로 전달
 */
export default async function Page({ searchParams }: PageProps<"/chat">) {
	const [{ buildingId: rawBuildingId, error }, session] = await Promise.all([
		searchParams,
		getSession(),
	]);

	if (!session) {
		redirect(paths.loginWithNext(toChatPath(rawBuildingId)));
	}

	let buildingId: Nullable<string> = null;
	let buildingRequest: ReturnType<typeof getChatBuilding> =
		Promise.resolve(null);

	if (rawBuildingId !== undefined) {
		if (typeof rawBuildingId !== "string") {
			notFound();
		}

		buildingId = rawBuildingId;
		buildingRequest = getChatBuilding(buildingId);
	}

	const [building, { dailyLimitReached }, chats] = await Promise.all([
		buildingRequest,
		getChatLimit(),
		getChatList(),
	]);

	if (buildingId !== null && building === null) {
		notFound();
	}

	return (
		<ChatPage
			session={session}
			currentPath={toChatPath(rawBuildingId)}
			chatId={null}
			buildingId={buildingId}
			buildingName={building?.name ?? null}
			initialMessages={[]}
			isLimitReached={dailyLimitReached}
			chats={chats}
			now={new Date()}
			formError={toFormError(error, ["chat-delete-failed"])}
		/>
	);
}

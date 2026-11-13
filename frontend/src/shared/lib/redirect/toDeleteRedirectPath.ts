import { toPositiveId } from "@/pages/chat/lib/toPositiveId";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

const chatPathPattern = /^\/chat(?:\/([1-9]\d*))?$/;

/**
 * 채팅 > 삭제 뒤 이동 경로
 *
 * - 요청이 /chat 또는 /chat/{번호}(데스크톱 레일)에서 왔고 열려 있던 대화가 삭제한 대화가 아니면 그 경로 반환
 * - 열려 있던 대화를 삭제했으면 /chat 반환
 * - 그 밖의 경우(대화 목록 화면, 출처를 알 수 없음)는 /chat/history 반환
 *
 * @param referer 요청의 Referer 헤더 값
 * @param deletedId 삭제한 대화 번호
 */
export function toDeleteRedirectPath(
	referer: Nullable<string>,
	deletedId: number,
): string {
	if (referer === null || !URL.canParse(referer)) {
		return paths.chatHistory;
	}

	const match = chatPathPattern.exec(new URL(referer).pathname);

	if (match === null) {
		return paths.chatHistory;
	}

	const openId = toPositiveId(match[1]);

	if (openId === null || openId === deletedId) {
		return paths.chat;
	}

	return paths.chatDetail(openId);
}

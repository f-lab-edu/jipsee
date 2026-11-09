import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

/**
 * 건물 질문하기 > 이동 주소 생성
 *
 * - 로그인하지 않았으면 채팅 경로를 돌아갈 경로로 담은 로그인 경로 반환
 * - 로그인했으면 건물 번호를 쿼리로 담은 채팅 경로 반환
 */
export function toAskBuildingHref(
	buildingId: number,
	session: Nullable<Session>,
): string {
	if (session) {
		return paths.chatWithBuilding(buildingId);
	}

	return paths.loginWithNext(paths.chatWithBuilding(buildingId));
}

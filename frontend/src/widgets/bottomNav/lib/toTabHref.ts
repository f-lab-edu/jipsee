import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { BottomNavTab } from "@/widgets/bottomNav/model/bottomNavTab";

/**
 * 하단 내비게이션 > 탭 이동 경로
 *
 * - 로그인하지 않았고 비로그인 경로가 있는 탭이면 그 경로 반환
 * - 그 밖에는 탭 경로 반환
 */
export function toTabHref(
	tab: BottomNavTab,
	session: Nullable<Session>,
): string {
	if (session) {
		return tab.path;
	}

	return tab.loggedOutPath ?? tab.path;
}

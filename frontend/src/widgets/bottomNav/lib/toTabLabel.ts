import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { BottomNavTab } from "@/widgets/bottomNav/model/bottomNavTab";

/**
 * 하단 내비게이션 > 탭 이름
 *
 * - 로그인하지 않았고 비로그인 이름이 있는 탭이면 그 이름 반환
 * - 그 밖에는 탭 이름 반환
 */
export function toTabLabel(
	tab: BottomNavTab,
	session: Nullable<Session>,
): string {
	if (session) {
		return tab.label;
	}

	return tab.loggedOutLabel ?? tab.label;
}

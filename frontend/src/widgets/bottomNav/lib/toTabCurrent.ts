import type { BottomNavTab } from "@/widgets/bottomNav/model/bottomNavTab";

/**
 * 하단 내비게이션 > 탭 aria-current 값
 *
 * - 현재 경로가 탭 경로와 같으면 page 반환
 * - 탭에서 이어지는 경로이면 true 반환
 * - 그 밖에는 undefined 반환
 */
export function toTabCurrent(
	tab: BottomNavTab,
	pathname: string,
): "page" | "true" | undefined {
	if (pathname === tab.path) {
		return "page";
	}

	if (tab.relatedPaths.includes(pathname)) {
		return "true";
	}

	if (tab.relatedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
		return "true";
	}

	return undefined;
}

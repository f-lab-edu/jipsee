import { pageTitleCopy } from "@/shared/config/pageTitleCopy";
import { phase2RoutesEnabled } from "@/shared/config/phase2Routes";
import { paths } from "@/shared/routes/paths";
import type { BottomNavTab } from "@/widgets/bottomNav/model/bottomNavTab";

const allBottomNavTabs: readonly BottomNavTab[] = [
	{
		id: "home",
		label: "홈",
		path: paths.home,
		relatedPaths: [paths.search],
		relatedPrefixes: [`${paths.buildings}/`],
	},
	{
		id: "chat",
		label: pageTitleCopy.chat,
		path: paths.chat,
		relatedPaths: [],
		relatedPrefixes: [`${paths.chat}/`],
	},
	{
		id: "me",
		label: pageTitleCopy.me,
		path: paths.me,
		loggedOutLabel: pageTitleCopy.login,
		loggedOutPath: paths.loginWithNext(paths.me),
		relatedPaths: [],
		relatedPrefixes: [],
	},
];

// phase2RoutesEnabled가 false이면 집사와 내 정보 탭을 숨김
export const bottomNavTabs: readonly BottomNavTab[] = phase2RoutesEnabled
	? allBottomNavTabs
	: allBottomNavTabs.filter((tab) => tab.id === "home");

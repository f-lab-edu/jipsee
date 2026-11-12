import { paths } from "@/shared/routes/paths";
import type { BottomNavTab } from "@/widgets/bottomNav/model/bottomNavTab";

export const bottomNavTabs: readonly BottomNavTab[] = [
	{
		id: "home",
		label: "홈",
		path: paths.home,
		relatedPaths: [paths.search],
		relatedPrefixes: [`${paths.buildings}/`],
	},
	{
		id: "chat",
		label: "집사",
		path: paths.chat,
		relatedPaths: [],
		relatedPrefixes: [`${paths.chat}/`],
	},
	{
		id: "me",
		label: "내 정보",
		path: paths.me,
		loggedOutPath: paths.loginWithNext(paths.me),
		relatedPaths: [],
		relatedPrefixes: [],
	},
];

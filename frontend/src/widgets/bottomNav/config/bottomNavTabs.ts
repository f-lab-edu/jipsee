import { pageTitleCopy } from "@/shared/config/pageTitleCopy";
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

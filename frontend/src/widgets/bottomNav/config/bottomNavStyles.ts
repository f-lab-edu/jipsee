import { bottomNavTabHeight } from "@/shared/config/bottomNavHeight";
import { typography } from "@/shared/config/typography";
import type { BottomNavStyle } from "@/widgets/bottomNav/model/bottomNavStyle";

// z-index는 헤더와 같고 Seed 다이얼로그, 시트(2)보다 낮게 둠
export const bottomNavStyles: BottomNavStyle = {
	root: {
		hideFrom: "lg",
		position: "sticky",
		bottom: 0,
		zIndex: 1,
		pb: "env(safe-area-inset-bottom)",
		bg: "bg.layerDefault",
		borderTopWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	list: { width: "full", maxWidth: "720px", mx: "auto", m: 0, p: 0 },
	item: { flexGrow: 1, width: "0px", minWidth: "0px" },
	link: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "x0_5",
		height: bottomNavTabHeight,
	},
	active: {
		icon: { size: "x6", color: "fg.brand" },
		label: {
			...typography.size12LineHeight16,
			fontWeight: "bold",
			color: "fg.brand",
		},
		strokeWidth: 2.2,
	},
	inactive: {
		icon: { size: "x6", color: "fg.neutralMuted" },
		label: {
			...typography.size12,
			fontWeight: "medium",
			color: "fg.neutralMuted",
		},
		strokeWidth: 1.8,
	},
};

import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
} from "@seed-design/react";
import { bottomNavTabHeight } from "@/shared/config/bottomNavHeight";
import { columnWidth } from "@/shared/config/columnWidth";
import { typography } from "@/shared/config/typography";

export interface BottomNavTabStateStyle {
	icon: Omit<IconProps, "svg">;
	label: TextProps;
	strokeWidth: number;
}

export interface BottomNavStyle {
	root: BoxProps;
	list: HStackProps;
	item: BoxProps;
	link: BoxProps;
	active: BottomNavTabStateStyle;
	inactive: BottomNavTabStateStyle;
}

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
	list: { width: "full", maxWidth: columnWidth.wide, mx: "auto", m: 0, p: 0 },
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
		icon: { size: "24px", color: "fg.brand" },
		label: {
			...typography.size12LineHeight16,
			fontWeight: "bold",
			color: "fg.brand",
		},
		strokeWidth: 2.2,
	},
	inactive: {
		icon: { size: "24px", color: "fg.neutralMuted" },
		label: {
			...typography.size12LineHeight16,
			fontWeight: "medium",
			color: "fg.neutralMuted",
		},
		strokeWidth: 1.8,
	},
};

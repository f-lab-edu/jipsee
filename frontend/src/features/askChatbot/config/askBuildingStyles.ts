import type { BoxProps } from "@seed-design/react";
import type { AskBuildingStyle } from "@/features/askChatbot/model/askBuildingStyle";
import { bottomBarOffset } from "@/shared/config/bottomNavHeight";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const buttonShared: BoxProps = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "x2",
	color: "fg.onBrandSolid",
	className: "brand-filled-button",
};

export const askBuildingStyles: AskBuildingStyle = {
	bar: {
		hideFrom: "lg",
		display: "flex",
		flexDirection: "column",
		position: "sticky",
		bottom: bottomBarOffset,
		pt: "x3",
		px: "spacingX.globalGutter",
		pb: "x4",
		bg: "bg.layerFloating",
		borderTopWidth: 1,
		borderColor: "stroke.neutralMuted",
		className: "chat-panel-shadow",
	},
	card: {
		display: "flex",
		flexDirection: "column",
		p: "x6",
		bg: "bg.layerFloating",
		borderRadius: "r5",
		borderWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	button: defineResponsiveStyles<BoxProps>({
		mobile: { ...buttonShared, height: "52px", borderRadius: "r3" },
		desktop: { ...buttonShared, height: "56px", borderRadius: "r3_5" },
	}),
	buttonIcon: { size: "20px", color: "fg.onBrandSolid" },
	buttonText: {
		...typography.size16,
		fontWeight: "bold",
		color: "fg.onBrandSolid",
	},
};

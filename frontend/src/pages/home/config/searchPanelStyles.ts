import type { SearchPanelStyle } from "@/pages/home/model/searchPanelStyle";
import { typography } from "@/shared/config/typography";

export const searchPanelStyles: SearchPanelStyle = {
	root: { position: "relative" },
	background: {
		display: { base: "none", lg: "block" },
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		bg: "bg.layerDefault",
		borderWidth: 1,
		borderColor: "stroke.neutralMuted",
		borderRadius: "r5",
	},
	content: {
		position: "relative",
		gap: { base: "x3", lg: "x5" },
		px: { base: "spacingX.globalGutter", lg: "x8" },
		pt: { base: "x1", lg: "x7" },
		pb: { base: "x3", lg: "x7" },
	},
	titleRow: {
		display: { base: "none", lg: "flex" },
		justifyContent: "space-between",
		alignItems: "flex-end",
		gap: "x6",
	},
	titleBlock: { gap: "x1_5" },
	title: { ...typography.size26, fontWeight: "bold", color: "fg.neutral" },
	description: { ...typography.size15, color: "fg.neutralMuted" },
	desktopNoticeCell: { flexShrink: 0 },
	mobileNoticeCell: { hideFrom: "lg" },
};

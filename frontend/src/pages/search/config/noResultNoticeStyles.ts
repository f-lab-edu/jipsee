import type { NoResultNoticeStyle } from "@/pages/search/model/noResultNoticeStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const noResultNoticeStyles = defineResponsiveStyles<NoResultNoticeStyle>(
	{
		mobile: {
			root: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				flexGrow: 1,
				gap: "x4",
				px: "x8",
				py: "x6",
			},
			circle: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "72px",
				height: "72px",
				borderRadius: "full",
				bg: "bg.neutralWeak",
			},
			icon: { size: "34px", color: "fg.neutralSubtle" },
			textBlock: {
				display: "flex",
				flexDirection: "column",
				gap: "x1_5",
			},
			title: {
				...typography.size16LineHeight24,
				fontWeight: "bold",
				align: "center",
				color: "fg.neutral",
			},
			description: {
				...typography.size14,
				align: "center",
				color: "fg.neutralMuted",
			},
		},
		desktop: {
			root: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				flexGrow: 1,
				gap: "x4",
				bg: "bg.layerDefault",
				borderWidth: 1,
				borderColor: "stroke.neutralMuted",
				borderRadius: "r5",
			},
			circle: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "80px",
				height: "80px",
				borderRadius: "full",
				bg: "bg.neutralWeak",
			},
			icon: { size: "36px", color: "fg.neutralSubtle" },
			textBlock: {
				display: "flex",
				flexDirection: "column",
				gap: "x1_5",
			},
			title: {
				...typography.size18,
				fontWeight: "bold",
				align: "center",
				color: "fg.neutral",
			},
			description: {
				...typography.size15,
				align: "center",
				color: "fg.neutralMuted",
			},
		},
	},
);

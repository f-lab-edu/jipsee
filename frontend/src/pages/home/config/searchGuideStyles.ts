import type { SearchGuideLayoutStyle } from "@/pages/home/model/searchGuideLayoutStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const searchGuideStyles = defineResponsiveStyles<SearchGuideLayoutStyle>(
	{
		mobile: {
			root: { pt: "x5", px: "spacingX.globalGutter", pb: "x2" },
			panel: {
				gap: "x3",
				p: "x4",
				bg: "bg.layerDefault",
				borderWidth: 1,
				borderColor: "stroke.neutralMuted",
				borderRadius: "r3_5",
			},
			title: { ...typography.size14, fontWeight: "bold", color: "fg.neutral" },
			items: { columns: 1, gap: "x3" },
			item: { alignItems: "flex-start", gap: "x2_5" },
			iconCell: { display: "flex", flexShrink: 0, mt: "1px" },
			checkIcon: { size: "18px", color: "bg.brandSolid" },
			slashIcon: { size: "18px", color: "fg.neutralSubtle" },
			clockIcon: { size: "18px", color: "fg.neutralSubtle" },
			text: { ...typography.size13LineHeight20, color: "fg.neutralMuted" },
			highlight: {
				...typography.size13LineHeight20,
				fontWeight: "bold",
				color: "fg.brand",
			},
		},
		desktop: {
			root: {},
			panel: {
				gap: "x3",
				p: "x5",
				bg: "bg.layerDefault",
				borderWidth: 1,
				borderColor: "stroke.neutralMuted",
				borderRadius: "r4",
			},
			title: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
			items: { columns: 1, gap: "x3" },
			item: { alignItems: "flex-start", gap: "x2_5" },
			iconCell: { display: "flex", flexShrink: 0 },
			checkIcon: { size: "x5", color: "bg.brandSolid" },
			slashIcon: { size: "x5", color: "fg.neutralSubtle" },
			clockIcon: { size: "x5", color: "fg.neutralSubtle" },
			text: { ...typography.size14, color: "fg.neutralMuted" },
			highlight: {
				...typography.size14,
				fontWeight: "bold",
				color: "fg.brand",
			},
		},
	},
);

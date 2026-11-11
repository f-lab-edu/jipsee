import type { BuildingInfoSectionStyle } from "@/pages/building/model/buildingInfoSectionStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const shared: Omit<BuildingInfoSectionStyle, "section"> = {
	heading: { gap: "x0_5" },
	title: {
		...typography.size18LineHeight24,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	address: { ...typography.size14, color: "fg.neutralMuted" },
	baseMonth: {
		...typography.size12LineHeight16,
		align: "right",
		color: "fg.neutralMuted",
	},
};

export const buildingInfoSectionStyles =
	defineResponsiveStyles<BuildingInfoSectionStyle>({
		mobile: {
			...shared,
			section: {
				gap: "x3",
				bg: "bg.layerDefault",
				pt: "x5",
				px: "spacingX.globalGutter",
				pb: "x6",
			},
		},
		desktop: {
			...shared,
			section: {
				gap: "x3_5",
				bg: "bg.layerDefault",
				p: "x6",
				borderRadius: "r5",
				borderWidth: 1,
				borderColor: "stroke.neutralMuted",
			},
		},
	});

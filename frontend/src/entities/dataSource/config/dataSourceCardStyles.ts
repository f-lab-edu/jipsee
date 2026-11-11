import type { DataSourceCardStyle } from "@/entities/dataSource/model/dataSourceCardStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export const dataSourceCardStyles = defineResponsiveStyles<DataSourceCardStyle>(
	{
		mobile: {
			card: {
				py: "x4",
				px: "x5",
				bg: "bg.layerDefault",
				borderWidth: 1,
				borderColor: "stroke.neutralWeak",
				borderRadius: "r4",
			},
			name: {
				...typography.size17LineHeight24,
				fontWeight: "bold",
				color: "fg.neutral",
			},
			providerBox: { mt: "x0_5" },
			provider: { ...typography.size14, color: "fg.neutralMuted" },
			footer: {
				mt: "x1",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "x3",
			},
			updateLine: { ...typography.size14, color: "fg.neutralMuted" },
			originalLink: {
				display: "flex",
				alignItems: "center",
				flexShrink: 0,
				gap: "x0_5",
				minHeight: "44px",
				pl: "x3",
			},
			originalLinkText: {
				...typography.size14,
				fontWeight: "bold",
				color: "fg.brand",
			},
			originalLinkIcon: { size: "16px", color: "fg.brand" },
		},
		desktop: {
			card: {
				py: "x5",
				px: "x6",
				bg: "bg.layerDefault",
				borderWidth: 1,
				borderColor: "stroke.neutralMuted",
				borderRadius: "r5",
			},
			name: {
				...typography.size17LineHeight24,
				fontWeight: "bold",
				color: "fg.neutral",
			},
			providerBox: { mt: "x0_5" },
			provider: { ...typography.size14, color: "fg.neutralMuted" },
			footer: {
				mt: "x1",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "x3",
			},
			updateLine: { ...typography.size14, color: "fg.neutralMuted" },
			originalLink: {
				display: "flex",
				alignItems: "center",
				flexShrink: 0,
				gap: "x0_5",
				minHeight: "44px",
				pl: "x3",
			},
			originalLinkText: {
				...typography.size14,
				fontWeight: "bold",
				color: "fg.brand",
			},
			originalLinkIcon: { size: "16px", color: "fg.brand" },
		},
	},
);

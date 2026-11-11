import type { DataSourceCardStyle } from "@/entities/dataSource/model/dataSourceCardStyle";
import { typography } from "@/shared/config/typography";

export const dataSourceCardStyles: DataSourceCardStyle = {
	card: {
		gap: "x1",
		p: "x4",
		bg: "bg.layerDefault",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "r3_5",
	},
	name: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
	provider: { ...typography.size13, color: "fg.neutralMuted" },
	footer: { alignItems: "center", justifyContent: "space-between", gap: "x3" },
	updateLine: { ...typography.size13, color: "fg.neutralMuted" },
	originalLink: { ...typography.size13, color: "fg.brandContrast" },
};

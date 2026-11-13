import type { AreaFixedRowStyle } from "@/pages/building/model/areaFixedRowStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const shared: Omit<AreaFixedRowStyle, "labelCell"> = {
	row: { display: "flex", alignItems: "center", gap: "x2", width: "100%" },
	label: { ...typography.size13, color: "fg.neutralMuted" },
	content: { display: "flex", alignItems: "center", gap: "x1_5" },
	icon: { size: "14px", color: "fg.neutral" },
	text: { ...typography.size14, color: "fg.neutral" },
};

export const areaFixedRowStyles = defineResponsiveStyles<AreaFixedRowStyle>({
	mobile: {
		...shared,
		labelCell: { display: "flex", width: "36px", flexShrink: 0 },
	},
	desktop: { ...shared, labelCell: { display: "flex" } },
});

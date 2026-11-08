import type { DongInfoCardStyle } from "@/entities/building/model/dongInfoCardStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const shared: Omit<DongInfoCardStyle, "title"> = {
	card: {
		gap: "x3",
		p: "x4",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "r3_5",
	},
	list: { gap: "12px 16px" },
	item: { gap: "x0_5" },
	wideItem: { gridColumn: "span 2" },
	label: { ...typography.size12LineHeight16, color: "fg.neutralMuted" },
	value: { ...typography.size14, fontWeight: "medium", color: "fg.neutral" },
};

export const dongInfoCardStyles = defineResponsiveStyles<DongInfoCardStyle>({
	mobile: {
		...shared,
		title: {
			...typography.size16,
			fontWeight: "bold",
			color: "fg.neutral",
		},
	},
	desktop: {
		...shared,
		title: { ...typography.size15, fontWeight: "bold", color: "fg.neutral" },
	},
});

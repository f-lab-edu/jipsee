import type {
	BoxProps,
	FlexProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";

export interface BuildingSummaryItemStyle {
	row: FlexProps;
	body: VStackProps;
	name: TextProps;
	detailCell: BoxProps;
	detail: TextProps;
	chevronCell: BoxProps;
	chevron: Omit<IconProps, "svg">;
}

export const buildingSummaryItemStyles: BuildingSummaryItemStyle = {
	row: {
		alignItems: "center",
		gap: "x3",
		px: "spacingX.globalGutter",
		py: "x3_5",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	body: { flexGrow: 1, minWidth: "0px", gap: "x0_5" },
	name: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
	detailCell: { display: "flex", mt: "x1" },
	detail: { ...typography.size13, color: "fg.neutralMuted" },
	chevronCell: { display: "flex", flexShrink: 0 },
	chevron: { size: "18px", color: "fg.placeholder" },
};

import type {
	BoxProps,
	FlexProps,
	IconProps,
	TextProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

export interface LoadMoreStyle {
	area: FlexProps;
	button: BoxProps;
	buttonText: TextProps;
	buttonIcon: Omit<IconProps, "svg">;
	loadingIconBox: BoxProps;
	loadingIcon: Omit<IconProps, "svg">;
	error: FlexProps;
	errorRow: FlexProps;
	errorIcon: Omit<IconProps, "svg">;
	errorText: TextProps;
	retryButton: BoxProps;
	retryText: TextProps;
}

const common = {
	buttonText: { ...typography.size15, fontWeight: "bold", color: "fg.neutral" },
	buttonIcon: { size: "16px" },
	loadingIconBox: { display: "flex", className: "spin-icon" },
	loadingIcon: { size: "18px" },
	errorRow: { alignItems: "flex-start", gap: "x2" },
	errorIcon: { size: "18px", color: "fg.criticalContrast" },
	errorText: {
		...typography.size14,
		fontWeight: "medium",
		color: "fg.criticalContrast",
	},
	retryButton: {
		display: "flex",
		alignItems: "center",
		flexShrink: 0,
		height: "44px",
		px: "18px",
		bg: "bg.layerDefault",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "r3",
	},
	retryText: { ...typography.size14, fontWeight: "bold", color: "fg.neutral" },
} satisfies Partial<LoadMoreStyle>;

const commonButton = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	gap: "x2",
	height: "48px",
	px: "x6",
	bg: "bg.layerDefault",
	borderWidth: 1,
	borderColor: "stroke.neutralWeak",
	borderRadius: "r3",
} satisfies LoadMoreStyle["button"];

export const loadMoreStyles = defineResponsiveStyles<LoadMoreStyle>({
	mobile: {
		...common,
		area: {
			direction: "column",
			pt: "x4",
			pb: "x5",
			px: "spacingX.globalGutter",
		},
		button: { ...commonButton, width: "full" },
		error: {
			direction: "column",
			alignItems: "flex-start",
			gap: "x2_5",
			px: "x3_5",
			py: "x3",
			bg: "bg.criticalWeak",
			borderRadius: "14px",
		},
	},
	desktop: {
		...common,
		area: {
			direction: "column",
			alignItems: "center",
			pt: "x5",
			pb: "x4",
			px: "x8",
		},
		button: { ...commonButton, minWidth: "240px" },
		error: {
			direction: "row",
			alignItems: "center",
			gap: "x4",
			pl: "x4",
			pr: "x2",
			py: "x2",
			bg: "bg.criticalWeak",
			borderRadius: "14px",
		},
	},
});

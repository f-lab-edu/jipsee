import type { BoxProps, VStackProps } from "@seed-design/react";

export interface IntroBandStyle {
	root: BoxProps;
	content: VStackProps;
	formGroup: VStackProps;
}

export const introBandStyles: IntroBandStyle = {
	root: {
		position: "relative",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		flexGrow: 1,
	},
	content: {
		position: "relative",
		gap: { base: "x6", lg: "x7" },
		px: { base: "spacingX.globalGutter", lg: "x12" },
		pt: { base: "x7", lg: "x12" },
		pb: { base: "x8", lg: "x12" },
	},
	formGroup: { gap: "x3" },
};

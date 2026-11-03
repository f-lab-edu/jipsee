import type { IntroBandStyle } from "@/pages/home/model/introBandStyle";

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
	headingRow: {
		direction: { base: "column", lg: "row" },
		gap: { base: 0, lg: "x10" },
	},
	headingColumn: {
		flexGrow: 1,
		minWidth: "0px",
		justifyContent: "center",
	},
	formGroup: { gap: "x3" },
	desktopIllustrationCell: {
		display: { base: "none", lg: "flex" },
		alignItems: "center",
		width: "320px",
		minWidth: "0px",
	},
};

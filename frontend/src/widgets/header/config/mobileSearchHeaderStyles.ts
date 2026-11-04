import type { MobileSearchHeaderStyle } from "@/widgets/header/model/mobileSearchHeaderStyle";

export const mobileSearchHeaderStyles: MobileSearchHeaderStyle = {
	row: {
		py: "x1_5",
		pl: "x1",
		pr: "spacingX.globalGutter",
		gap: "x1",
		alignItems: "flex-start",
		bg: "transparent",
	},
	backLink: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		width: "44px",
		height: "44px",
	},
	backIcon: { size: "24px", color: "fg.neutral" },
	formCell: { flexGrow: 1, minWidth: "0px" },
};

import type { MobileSearchHeaderStyle } from "@/widgets/header/model/mobileSearchHeaderStyle";

export const mobileSearchHeaderStyles: MobileSearchHeaderStyle = {
	row: {
		height: "56px",
		pl: "x1",
		pr: "spacingX.globalGutter",
		gap: "x1",
		alignItems: "center",
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

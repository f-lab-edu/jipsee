import type { HeaderBackStyle } from "@/widgets/header/model/headerBackStyle";

export const headerBackStyles: HeaderBackStyle = {
	box: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		width: "44px",
		height: "44px",
		ml: "-10px",
	},
	icon: { size: "24px", color: "fg.neutral" },
};

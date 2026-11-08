import type { BuildingScreenStyle } from "@/pages/building/model/buildingScreenStyle";

export const buildingScreenStyles: BuildingScreenStyle = {
	page: { minHeight: "100dvh" },
	column: {
		width: "full",
		maxWidth: { base: "480px", md: "720px", lg: "none" },
		mx: "auto",
		flexGrow: 1,
		className: "building-column",
	},
	main: { flexGrow: 1 },
};

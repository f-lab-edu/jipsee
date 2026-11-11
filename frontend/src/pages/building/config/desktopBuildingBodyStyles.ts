import type { DesktopBuildingBodyStyle } from "@/pages/building/model/desktopBuildingBodyStyle";
import { desktopHeaderHeight } from "@/shared/config/headerHeight";

export const desktopBuildingBodyStyles: DesktopBuildingBodyStyle = {
	container: { pt: "x7", pb: "x10", gap: "x6" },
	grid: {
		columns: { base: 1, lg: "minmax(0, 1fr) 380px" },
		gap: { base: 0, lg: "x6" },
		alignItems: "flex-start",
	},
	mainCell: { display: "flex", flexDirection: "column", gap: "x6" },
	asideCell: {
		position: "sticky",
		top: `calc(${desktopHeaderHeight} + var(--seed-dimension-x6))`,
		maxHeight: `calc(100dvh - ${desktopHeaderHeight} - var(--seed-dimension-x6) * 2)`,
		overflowY: "auto",
	},
	aside: { gap: "x4" },
};

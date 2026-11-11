import type { SearchScreenStyle } from "@/pages/search/model/searchScreenStyle";

export const searchScreenStyles: SearchScreenStyle = {
	main: { flexGrow: 1, className: "page-card" },
	grid: {
		flexGrow: 1,
		columns: { base: 1, lg: "minmax(0, 1fr) 380px" },
		gap: { base: 0, lg: "x6" },
		pt: { base: 0, lg: "x8" },
		pb: { base: 0, lg: "x6" },
	},
	bodyCell: { display: "flex", flexDirection: "column" },
	body: { flexGrow: 1, gap: { base: 0, lg: "x5" } },
	asideCell: { display: { base: "none", lg: "flex" }, flexDirection: "column" },
};

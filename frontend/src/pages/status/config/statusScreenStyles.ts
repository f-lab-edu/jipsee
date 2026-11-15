import type { StatusScreenStyle } from "@/pages/status/model/statusScreenStyle";

export const statusScreenStyles: StatusScreenStyle = {
	page: { minHeight: "100dvh" },
	column: {
		width: "full",
		maxWidth: { base: "480px", md: "720px", lg: "none" },
		mx: "auto",
		flexGrow: 1,
		className: "page-column",
	},
	main: { flexGrow: 1 },
};

import type { DataSourcesStyle } from "@/pages/policy/model/dataSourcesStyle";
import { typography } from "@/shared/config/typography";

export const dataSourcesStyles: DataSourcesStyle = {
	cardList: { gap: "x3" },
	notice: {
		display: "flex",
		flexDirection: "column",
		gap: "x1_5",
		px: "x4",
		py: "x3_5",
		borderRadius: "r3",
		bg: "bg.informativeWeak",
	},
	noticeText: { ...typography.size14, color: "fg.informativeContrast" },
	noticeLink: {
		...typography.size14,
		color: "fg.informativeContrast",
		textDecorationLine: "underline",
	},
};

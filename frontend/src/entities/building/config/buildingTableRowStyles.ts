import type { BuildingTableRowStyle } from "@/entities/building/model/buildingTableRowStyle";
import { typography } from "@/shared/config/typography";

export const buildingTableRowStyles: BuildingTableRowStyle = {
	row: {
		position: "relative",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	buildingCell: { display: "flex", px: "x8", py: "x3_5" },
	link: { gap: "x0_5", className: "stretched-link" },
	name: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
	useApprovalCell: { display: "flex", px: "x4", py: "x3_5" },
	useApproval: { ...typography.size14, color: "fg.neutral" },
	latestCell: { display: "flex", px: "x4", py: "x3_5" },
	latestDate: {
		...typography.size14,
		fontWeight: "medium",
		color: "fg.neutral",
	},
	badge: {
		display: "flex",
		px: "x2",
		py: "x0_5",
		borderRadius: "r1_5",
		bg: "bg.neutralWeak",
	},
	badgeText: { ...typography.size13, color: "fg.neutralMuted" },
	chevronCell: {
		display: "flex",
		justifyContent: "flex-end",
		pr: "x6",
		py: "x3_5",
	},
	chevronLink: { display: "flex" },
	chevron: { size: "18px", color: "fg.placeholder" },
};

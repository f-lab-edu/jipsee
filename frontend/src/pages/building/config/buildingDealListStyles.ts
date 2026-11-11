import type { BuildingDealListStyle } from "@/pages/building/model/buildingDealListStyle";
import { typography } from "@/shared/config/typography";

export const buildingDealListStyles: BuildingDealListStyle = {
	list: { m: 0, p: 0 },
	headerRow: {
		gap: "x4",
		py: "x2_5",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralWeak",
	},
	headerCell: { display: "flex" },
	amountHeaderCell: { display: "flex", justifyContent: "flex-end" },
	headerText: { ...typography.size13, color: "fg.neutralMuted" },
};

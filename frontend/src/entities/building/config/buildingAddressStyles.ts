import type { BuildingAddressStyle } from "@/entities/building/model/buildingAddressStyle";
import { typography } from "@/shared/config/typography";

export const buildingAddressStyles: BuildingAddressStyle = {
	text: { ...typography.size14, color: "fg.neutralMuted" },
};

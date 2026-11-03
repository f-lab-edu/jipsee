import type { BoxProps } from "@seed-design/react";
import type { HomeState } from "@/pages/home/model/homeState";

export const headerBackgrounds: Record<HomeState, BoxProps["bg"]> = {
	beforeSearch: "bg.brandWeak",
	queryTooShort: "bg.brandWeak",
	found: "bg.layerDefault",
	noResult: "bg.layerDefault",
};

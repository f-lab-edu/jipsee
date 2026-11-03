import type { BoxProps } from "@seed-design/react";
import type { HomeState } from "@/pages/home/model/homeState";
import { colors } from "@/shared/config/colors";

export const headerBackgrounds: Record<HomeState, BoxProps["bg"]> = {
	beforeSearch: colors.brandTintBackground,
	queryTooShort: colors.brandTintBackground,
	found: "transparent",
	noResult: "transparent",
};

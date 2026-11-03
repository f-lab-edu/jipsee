import type { SearchFormStyle } from "@/features/searchBuildings/model/searchFormStyle";
import type { SearchFormVariant } from "@/features/searchBuildings/model/searchFormVariant";
import { typography } from "@/shared/config/typography";

export const searchFormStyles: Record<SearchFormVariant, SearchFormStyle> = {
	intro: {
		container: { px: "spacingX.globalGutter" },
		row: { gap: "x3", alignItems: "center" },
		fieldCell: { flexGrow: 1 },
		field: { className: "search-field--intro" },
		input: { className: "search-field__input" },
		leading: {
			display: { base: "none", lg: "flex" },
			width: "x5",
			height: "x5",
			className: "search-field__leading",
		},
		leadingIcon: { size: "x5", color: "fg.neutralMuted" },
		iconButton: {
			display: "flex",
			hideFrom: "lg",
			alignItems: "center",
			justifyContent: "center",
			width: "44px",
			height: "44px",
			p: 0,
			borderWidth: 0,
			borderRadius: "r2_5",
			color: "fg.onBrandSolid",
			className: "brand-filled-button search-field__trailing",
		},
		iconButtonIcon: { size: "x5" },
		textButton: {
			display: { base: "none", lg: "flex" },
			alignItems: "center",
			justifyContent: "center",
			height: "60px",
			px: "x8",
			borderWidth: 0,
			borderRadius: "r3_5",
			color: "fg.onBrandSolid",
			className: "brand-filled-button",
		},
		textButtonLabel: { ...typography.size16, fontWeight: "bold" },
	},
};

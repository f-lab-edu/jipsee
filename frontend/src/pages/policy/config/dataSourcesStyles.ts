import type { DataSourcesStyle } from "@/pages/policy/model/dataSourcesStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

// 링크 글자 굵기 600은 Seed fontWeight에 없어 bold로 쓰고, 밑줄 간격(3px)은 Seed에 속성이 없어 기본값으로 둠
export const dataSourcesStyles = defineResponsiveStyles<DataSourcesStyle>({
	mobile: {
		cardList: { mt: "x5", gap: "x3" },
		notice: {
			mt: "x5",
			py: "x4",
			px: "x5",
			bg: "bg.layerDefault",
			borderWidth: 1,
			borderColor: "stroke.neutralWeak",
			borderRadius: "r4",
		},
		noticeList: { gap: "x2", pl: "x5", className: "policy-list" },
		noticeItem: { pl: "x0_5" },
		noticeText: { ...typography.size14LineHeight22, color: "fg.neutral" },
		noticeLink: {
			...typography.size14LineHeight22,
			fontWeight: "bold",
			color: "fg.brand",
			textDecorationLine: "underline",
		},
	},
	desktop: {
		cardList: { gap: "x4" },
		notice: {
			py: "x5",
			px: "x6",
			bg: "bg.layerDefault",
			borderWidth: 1,
			borderColor: "stroke.neutralWeak",
			borderRadius: "r4",
		},
		noticeList: { gap: "x2", pl: "x5", className: "policy-list" },
		noticeItem: { pl: "x0_5" },
		noticeText: { ...typography.size15LineHeight24, color: "fg.neutral" },
		noticeLink: {
			...typography.size15LineHeight24,
			fontWeight: "bold",
			color: "fg.brand",
			textDecorationLine: "underline",
		},
	},
});

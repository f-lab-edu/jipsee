import type { TextProps, VStackProps } from "@seed-design/react";
import { policyScreenStyles } from "@/pages/policy/config/policyStyles";
import { columnWidth } from "@/shared/config/columnWidth";
import { typography } from "@/shared/config/typography";
import { toResponsiveTypography } from "@/shared/lib/responsiveTypography/toResponsiveTypography";

export interface DataSourcesScreenStyle {
	titleBox: VStackProps;
	title: TextProps;
	mobileBody: VStackProps;
	desktopBody: VStackProps;
	desktopColumn: VStackProps;
}

const titleTypography = toResponsiveTypography(
	typography.size22,
	typography.size26,
);

// 제목은 하나만 출력하므로 본문 위쪽 여백(모바일 위 20, 데스크톱 위 40)과 제목 아래 간격(데스크톱 16)을 제목 칸이 갖고 본문은 위 여백 없이 이어짐
export const dataSourcesScreenStyles: DataSourcesScreenStyle = {
	titleBox: {
		width: { base: "auto", lg: columnWidth.wide },
		mx: { base: 0, lg: "auto" },
		px: { base: "spacingX.globalGutter", lg: 0 },
		pt: { base: "x5", lg: "x10" },
		pb: { base: 0, lg: "x4" },
	},
	title: {
		...titleTypography,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	mobileBody: { ...policyScreenStyles.mobileBody, pt: 0 },
	desktopBody: { ...policyScreenStyles.desktopBody, pt: 0 },
	desktopColumn: policyScreenStyles.desktopColumn,
};

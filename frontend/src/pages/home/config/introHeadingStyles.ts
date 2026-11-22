import type { FlexProps, TextProps, VStackProps } from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { toResponsiveTypography } from "@/shared/lib/responsiveTypography/toResponsiveTypography";

export interface IntroHeadingStyle {
	row: FlexProps;
	titleBlock: VStackProps;
	title: TextProps;
	description: TextProps;
	mobileIllustrationCell: FlexProps;
	desktopIllustrationCell: FlexProps;
}

const titleTypography = toResponsiveTypography(
	typography.size24,
	typography.size34,
);
const descriptionTypography = toResponsiveTypography(
	typography.size14,
	typography.size16LineHeight24,
);

// 제목 블록은 하나만 출력하고 모바일은 오른쪽에 작은 일러스트, 데스크톱은 오른쪽 폭 320 칸에 큰 일러스트를 둠
export const introHeadingStyles: IntroHeadingStyle = {
	row: {
		justifyContent: "space-between",
		gap: { base: "x4", lg: "x10" },
		className: "intro-heading-row",
	},
	titleBlock: {
		flexGrow: 1,
		minWidth: { base: "auto", lg: "0px" },
		gap: { base: "x2", lg: "x2_5" },
	},
	title: {
		...titleTypography,
		fontWeight: "bold",
		color: "fg.neutral",
		className: `${titleTypography.className} desktop-tight-letter-spacing`,
	},
	description: {
		...descriptionTypography,
		color: "fg.neutralMuted",
	},
	mobileIllustrationCell: {
		display: { base: "flex", lg: "none" },
		shrink: 0,
	},
	desktopIllustrationCell: {
		display: { base: "none", lg: "flex" },
		alignItems: "center",
		width: "320px",
		minWidth: "0px",
	},
};

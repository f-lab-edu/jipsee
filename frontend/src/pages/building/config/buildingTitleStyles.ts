import type {
	BoxProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { toResponsiveTypography } from "@/shared/lib/responsiveTypography/toResponsiveTypography";

export interface BuildingTitleStyle {
	root: VStackProps;
	row: BoxProps;
	backButton: BoxProps;
	backIcon: Omit<IconProps, "svg">;
	titleGroup: BoxProps;
	title: TextProps;
	addressCell: BoxProps;
	address: TextProps;
}

const titleTypography = toResponsiveTypography(
	typography.size18LineHeight24,
	typography.size28,
);

// 모바일은 줄과 묶음을 block으로 두어 h1이 폭 전체를 쓰게 함(내용 폭이면 글자 끝이 말줄임 영역에 잘림). 제목은 하나만 출력하므로 모바일 본문 첫 줄(위 20, 좌우 gutter)과 데스크톱 콘텐츠 컨테이너 첫 줄(위 28, 아래 24, 폭 1152)을 반응형 값으로 함께 정의
export const buildingTitleStyles: BuildingTitleStyle = {
	root: {
		width: { base: "auto", lg: "full" },
		maxWidth: { base: "none", lg: "1152px" },
		mx: { base: 0, lg: "auto" },
		px: { base: "spacingX.globalGutter", lg: "x6" },
		pt: { base: "x5", lg: "x7" },
		pb: { base: 0, lg: "x6" },
	},
	row: {
		display: { base: "block", lg: "flex" },
		gap: "x3",
		alignItems: "center",
	},
	backButton: {
		display: { base: "none", lg: "flex" },
		alignItems: "center",
		justifyContent: "center",
		flexShrink: 0,
		width: "44px",
		height: "44px",
		borderRadius: "full",
		bg: "bg.layerDefault",
	},
	backIcon: { size: "22px", color: "fg.neutral" },
	titleGroup: {
		gap: "x3",
		minWidth: "0px",
		display: { base: "block", lg: "flex" },
		className: "align-baseline",
	},
	title: {
		...titleTypography,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
	addressCell: { display: { base: "none", lg: "block" }, flexShrink: 0 },
	address: {
		...typography.size16LineHeight24,
		color: "fg.neutralMuted",
		whiteSpace: "nowrap",
	},
};

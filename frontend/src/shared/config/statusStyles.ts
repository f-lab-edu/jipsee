import type {
	BoxProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";
import { toResponsiveTypography } from "@/shared/lib/responsiveTypography/toResponsiveTypography";

export interface StatusStyle {
	body: VStackProps;
	card: VStackProps;
	root: VStackProps;
	circle: BoxProps;
	icon: Omit<IconProps, "svg">;
	textBlock: VStackProps;
	title: TextProps;
	description: TextProps;
	actions: VStackProps;
	primaryButton: BoxProps;
	primaryText: TextProps;
	secondaryButton: BoxProps;
	secondaryText: TextProps;
}

const buttonShared = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "full",
	height: "48px",
	borderRadius: "r3",
} as const;

const textShared = { ...typography.size15, fontWeight: "bold" } as const;

const circleShared = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "full",
	bg: "bg.neutralWeak",
} as const;

const descriptionColor = { align: "center", color: "fg.neutralMuted" } as const;

const shared = {
	root: { alignItems: "center" },
	textBlock: { alignItems: "center", gap: "x2", mt: "x5" },
	actions: { mt: "28px", width: "280px", maxWidth: "full", gap: "x2" },
	primaryButton: {
		...buttonShared,
		color: "fg.onBrandSolid",
		className: "brand-filled-button",
	},
	primaryText: { ...textShared, color: "fg.onBrandSolid" },
	secondaryButton: { ...buttonShared, bg: "bg.neutralWeak" },
	secondaryText: { ...textShared, color: "fg.neutral" },
} as const;

// Box가 content-box이므로 데스크톱 카드 폭 480은 테두리 2와 좌우 패딩 80을 제외한 398. a 요소의 버튼은 테두리가 없어 시안의 높이 그대로 사용
export const statusStyles = defineResponsiveStyles<StatusStyle>({
	mobile: {
		...shared,
		body: {
			flexGrow: 1,
			justifyContent: "center",
			px: "spacingX.globalGutter",
			py: "x6",
		},
		card: {},
		circle: { ...circleShared, width: "72px", height: "72px" },
		icon: { size: "32px", color: "fg.neutralMuted" },
		description: { ...typography.size14, ...descriptionColor },
		title: {
			...typography.size20,
			fontWeight: "bold",
			align: "center",
			color: "fg.neutral",
		},
	},
	desktop: {
		...shared,
		body: {
			flexGrow: 1,
			alignItems: "center",
			justifyContent: "center",
			px: "x6",
			py: "x10",
		},
		card: {
			width: "398px",
			px: "x10",
			py: "56px",
			bg: "bg.layerDefault",
			borderWidth: 1,
			borderColor: "stroke.neutralMuted",
			borderRadius: "r5",
		},
		circle: { ...circleShared, width: "80px", height: "80px" },
		icon: { size: "36px", color: "fg.neutralMuted" },
		description: { ...typography.size15, ...descriptionColor },
		title: {
			...typography.size22,
			fontWeight: "bold",
			align: "center",
			color: "fg.neutral",
		},
	},
});

const titleTypography = toResponsiveTypography(
	typography.size20,
	typography.size22,
);
const descriptionTypography = toResponsiveTypography(
	typography.size14,
	typography.size15,
);

// 상태 화면은 모바일과 데스크톱이 같은 요소를 쓰고 값만 반응형으로 바꿈(h1 하나). 카드의 배경, 테두리, 모서리는 반응형 값을 받지 않아 theme.css의 .status-card가 1280 이상에서 그리고, 아이콘 크기(32, 36)는 .status-circle이 변수로 정함
export const statusPanelStyles: StatusStyle = {
	...shared,
	body: {
		flexGrow: 1,
		alignItems: "center",
		justifyContent: "center",
		px: { base: "spacingX.globalGutter", lg: "x6" },
		py: { base: "x6", lg: "x10" },
	},
	card: {
		width: { base: "full", lg: "398px" },
		px: { base: 0, lg: "x10" },
		py: { base: 0, lg: "56px" },
		className: "status-card",
	},
	circle: {
		...circleShared,
		width: { base: "72px", lg: "80px" },
		height: { base: "72px", lg: "80px" },
		className: "status-circle",
	},
	icon: { color: "fg.neutralMuted" },
	description: { ...descriptionTypography, ...descriptionColor },
	title: {
		...titleTypography,
		fontWeight: "bold",
		align: "center",
		color: "fg.neutral",
	},
};

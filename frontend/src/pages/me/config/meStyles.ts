import { providerColors } from "@/entities/session/config/providerColors";
import type { MeSectionStyle, MeStyle } from "@/pages/me/model/meStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const iconShared = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	width: "40px",
	height: "40px",
	borderRadius: "full",
} as const;

export const meStyles: MeStyle = {
	main: { flexGrow: 1 },
	mobileBody: { flexGrow: 1, bg: "bg.layerDefault" },
	mobileTitleBox: { pt: "x5", px: "spacingX.globalGutter" },
	mobileTitle: {
		...typography.size18LineHeight24,
		fontWeight: "bold",
		color: "fg.neutral",
		maxLines: 1,
	},
	mobileDivider: { height: "8px", bg: "bg.layerBasement" },
	mobileSpacer: { flexGrow: 1 },
	desktopBody: { flexGrow: 1, alignItems: "center", px: "x6", py: "x10" },
	desktopColumn: { width: "480px", gap: "x4" },
	desktopTitleBox: { pb: "x2" },
	desktopTitle: {
		...typography.size26,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	// Box가 content-box이므로 구글은 테두리 1을 폭과 높이에서 뺌
	providerIcon: {
		GOOGLE: {
			...iconShared,
			width: "38px",
			height: "38px",
			bg: providerColors.GOOGLE.background,
			borderWidth: 1,
			borderColor: providerColors.GOOGLE.border,
		},
		KAKAO: { ...iconShared, bg: providerColors.KAKAO.background },
		NAVER: { ...iconShared, bg: providerColors.NAVER.background },
	},
	providerIconSize: { GOOGLE: 20, KAKAO: 20, NAVER: 16 },
};

const sectionShared: Omit<
	MeSectionStyle,
	"section" | "policySection" | "withdraw"
> = {
	title: { ...typography.size16, fontWeight: "bold", color: "fg.neutral" },
	provider: {
		alignItems: "center",
		gap: "x3",
		p: "x4",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "r3_5",
	},
	providerName: {
		...typography.size16,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	logout: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "full",
		height: "48px",
		borderRadius: "r3",
		bg: "bg.neutralWeak",
	},
	logoutText: { ...typography.size15, fontWeight: "bold", color: "fg.neutral" },
	// Box가 content-box이므로 행 높이 56에서 아래 구분선 1을 뺌
	policyRow: {
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: "55px",
		px: "x1",
		borderBottomWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
	policyLabel: { ...typography.size16, color: "fg.neutral" },
	policyArrowCell: { display: "flex", flexShrink: 0 },
	policyArrow: { size: "18px", color: "fg.neutralSubtle" },
	withdrawBody: { alignItems: "flex-start", gap: "x0_5" },
	// 캔버스의 min-height 44, 패딩 0, 글자 밑줄 오프셋 2는 Seed에 속성이 없어 브라우저 기본값을 씀
	withdrawButton: {
		display: "flex",
		alignItems: "center",
		minHeight: "44px",
	},
	withdrawButtonText: {
		...typography.size13,
		color: "fg.neutralMuted",
		textDecorationLine: "underline",
	},
	withdrawDescription: {
		...typography.size12LineHeight16,
		color: "fg.neutralMuted",
	},
};

export const meSectionStyles = defineResponsiveStyles<MeSectionStyle>({
	mobile: {
		...sectionShared,
		section: {
			gap: "x3",
			pt: "x5",
			px: "spacingX.globalGutter",
			pb: "x6",
			bg: "bg.layerDefault",
		},
		policySection: {
			gap: "x1",
			pt: "x5",
			px: "spacingX.globalGutter",
			pb: "x2",
			bg: "bg.layerDefault",
		},
		withdraw: {
			pt: "x4",
			px: "spacingX.globalGutter",
			pb: "x6",
			bg: "bg.layerDefault",
		},
	},
	desktop: {
		...sectionShared,
		section: {
			gap: "x3",
			p: "x6",
			bg: "bg.layerDefault",
			borderRadius: "r5",
			borderWidth: 1,
			borderColor: "stroke.neutralMuted",
		},
		policySection: {
			gap: "x1",
			pt: "x6",
			px: "x6",
			pb: "x2",
			bg: "bg.layerDefault",
			borderRadius: "r5",
			borderWidth: 1,
			borderColor: "stroke.neutralMuted",
		},
		withdraw: { pt: "x2", px: "x1" },
	},
});

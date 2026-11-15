import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";
import type { PartialStatusStyle } from "@/shared/model/partialStatusStyle";

const circleShared = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "full",
	bg: "bg.neutralWeak",
} as const;

const shared = {
	root: { alignItems: "center", gap: "x5", px: "x6" },
	icon: { size: "34px", color: "fg.neutralMuted" },
	title: {
		...typography.size17LineHeight24,
		fontWeight: "bold",
		align: "center",
		color: "fg.neutral",
	},
	// button은 border-box라 시안의 높이 44 그대로 사용
	retryButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "44px",
		px: "22px",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "r3",
		bg: "bg.layerDefault",
	},
	retryText: {
		...typography.size14,
		fontWeight: "bold",
		color: "fg.neutral",
	},
} as const;

export const partialStatusStyles = defineResponsiveStyles<PartialStatusStyle>({
	mobile: {
		...shared,
		panel: {
			flexGrow: 1,
			justifyContent: "center",
			px: "spacingX.globalGutter",
			py: "x6",
		},
		circle: { ...circleShared, width: "72px", height: "72px" },
	},
	desktop: {
		...shared,
		panel: {
			flexGrow: 1,
			alignItems: "center",
			justifyContent: "center",
			bg: "bg.layerDefault",
			borderWidth: 1,
			borderColor: "stroke.neutralMuted",
			borderRadius: "r5",
		},
		circle: { ...circleShared, width: "80px", height: "80px" },
	},
});

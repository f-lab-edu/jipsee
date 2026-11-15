import type { BuildingAddressStyle } from "@/entities/building/model/buildingAddressStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const common = {
	lines: { gap: "x0_5" },
	line: { alignItems: "center", gap: "x2" },
	label: {
		display: "flex",
		justifyContent: "center",
		flexShrink: 0,
		// content-box 상자라 안쪽 여백 없이 최소 폭만 44로 지정
		minWidth: "44px",
		borderRadius: "r1",
		bg: "bg.neutralWeak",
	},
	labelText: {
		...typography.size12,
		fontWeight: "medium",
		color: "fg.neutralMuted",
	},
} satisfies Partial<BuildingAddressStyle>;

export const buildingAddressStyles =
	defineResponsiveStyles<BuildingAddressStyle>({
		mobile: {
			...common,
			text: { ...typography.size13, color: "fg.neutralMuted" },
		},
		desktop: {
			...common,
			text: { ...typography.size14, color: "fg.neutralMuted" },
		},
	});

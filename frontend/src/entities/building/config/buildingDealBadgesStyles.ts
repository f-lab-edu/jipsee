import type { BoxProps } from "@seed-design/react";
import type { BuildingDealBadgesStyle } from "@/entities/building/model/buildingDealBadgesStyle";
import { typography } from "@/shared/config/typography";

const badge: BoxProps = {
	display: "flex",
	px: "x2",
	py: "x1",
	borderRadius: "r1_5",
};

export const buildingDealBadgesStyles: BuildingDealBadgesStyle = {
	container: { gap: "x1" },
	typeLabel: { ...typography.size12LineHeight16, fontWeight: "medium" },
	statusLabel: { ...typography.size12LineHeight16, fontWeight: "bold" },
	byType: {
		jeonse: {
			badge: { ...badge, bg: "bg.brandWeak" },
			label: { color: "fg.informativeContrast" },
		},
		wolse: {
			badge: { ...badge, bg: "bg.positiveWeak" },
			label: { color: "fg.positiveContrast" },
		},
		sale: {
			badge: { ...badge, bg: "bg.warningWeak" },
			label: { color: "fg.warningContrast" },
		},
	},
	cancelled: {
		badge: {
			...badge,
			boxShadow: "inset 0 0 0 1px var(--seed-color-stroke-critical-weak)",
		},
		label: { color: "palette.red800" },
	},
	similarBuilding: {
		badge: {
			...badge,
			boxShadow: "inset 0 0 0 1px var(--seed-color-stroke-neutral-weak)",
		},
		label: { color: "fg.neutralMuted" },
	},
};

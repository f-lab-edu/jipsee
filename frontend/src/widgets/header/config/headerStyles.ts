import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";
import type { HeaderStyle } from "@/widgets/header/model/headerStyle";

export const headerStyles = defineResponsiveStyles<HeaderStyle>({
	mobile: {
		row: {
			height: "56px",
			px: "spacingX.globalGutter",
			justifyContent: "space-between",
			alignItems: "center",
		},
		brandLink: { gap: "x2", alignItems: "center" },
		logoSize: 28,
		serviceName: {
			...typography.size20,
			fontWeight: "bold",
			color: "fg.neutral",
			className: "service-name",
		},
	},
	desktop: {
		container: {
			bg: "bg.layerDefault",
			borderBottomWidth: 1,
			borderColor: "stroke.neutralMuted",
		},
		row: {
			height: "64px",
			justifyContent: "space-between",
			alignItems: "center",
		},
		brandLink: { gap: "x2_5", alignItems: "center" },
		logoSize: 32,
		serviceName: {
			...typography.size22,
			fontWeight: "bold",
			color: "fg.neutral",
			className: "service-name",
		},
	},
});

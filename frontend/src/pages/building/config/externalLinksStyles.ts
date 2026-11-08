import type { BoxProps } from "@seed-design/react";
import type { ExternalLinksStyle } from "@/pages/building/model/externalLinksStyle";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";

const shared: Omit<ExternalLinksStyle, "container" | "link"> = {
	label: { ...typography.size14, fontWeight: "medium", color: "fg.neutral" },
	icon: { size: "16px", color: "fg.neutral" },
};

const sharedLink: BoxProps = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	height: "48px",
	borderRadius: "r3",
	bg: "bg.neutralWeak",
};

export const externalLinksStyles = defineResponsiveStyles<ExternalLinksStyle>({
	mobile: {
		...shared,
		container: { columns: 2, gap: "x2" },
		link: { ...sharedLink, px: "x3_5", gap: "x1_5" },
	},
	desktop: {
		...shared,
		container: { columns: 1, gap: "x2" },
		link: { ...sharedLink, px: "x4" },
	},
});

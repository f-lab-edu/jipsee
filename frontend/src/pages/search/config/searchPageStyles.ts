import type { BoxProps, VStackProps } from "@seed-design/react";

export interface SearchPageStyle {
	panelGroup: VStackProps;
	guideCell: BoxProps;
}

export const searchPageStyles: SearchPageStyle = {
	panelGroup: { gap: { base: 0, lg: "x3" } },
	guideCell: { pt: { base: "x2_5", lg: 0 } },
};

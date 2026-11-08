import type { BoxProps, IconProps, TextProps } from "@seed-design/react";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

export interface AskBuildingStyle {
	bar: BoxProps;
	card: BoxProps;
	button: Record<ResponsiveVariant, BoxProps>;
	buttonIcon: Omit<IconProps, "svg">;
	buttonText: TextProps;
	guide: BoxProps;
	guideIcon: Omit<IconProps, "svg">;
	guideText: TextProps;
}

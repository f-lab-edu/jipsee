import type {
	BoxProps,
	GridProps,
	IconProps,
	TextProps,
} from "@seed-design/react";

export interface ExternalLinksStyle {
	container: GridProps;
	link: BoxProps;
	label: TextProps;
	icon: Omit<IconProps, "svg">;
}

import type {
	BoxProps,
	HStackProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface DataSourceCardStyle {
	card: VStackProps;
	name: TextProps;
	providerBox: BoxProps;
	provider: TextProps;
	footer: HStackProps;
	updateLine: TextProps;
	originalLink: BoxProps;
	originalLinkText: TextProps;
	originalLinkIcon: Omit<IconProps, "svg">;
}

import type {
	BoxProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface BuildingAddressStyle {
	lines: VStackProps;
	line: HStackProps;
	label: BoxProps;
	labelText: TextProps;
	text: TextProps;
}

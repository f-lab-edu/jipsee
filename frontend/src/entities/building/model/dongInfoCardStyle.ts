import type {
	BoxProps,
	GridProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface DongInfoCardStyle {
	card: VStackProps;
	title: TextProps;
	list: GridProps;
	item: VStackProps;
	wideItem: Pick<BoxProps, "gridColumn">;
	label: TextProps;
	value: TextProps;
}

import type {
	BoxProps,
	GridProps,
	IconProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface BuildingTableRowStyle {
	row: GridProps;
	buildingCell: BoxProps;
	link: VStackProps;
	name: TextProps;
	useApprovalCell: BoxProps;
	useApproval: TextProps;
	latestCell: BoxProps;
	latestDate: TextProps;
	badge: BoxProps;
	badgeText: TextProps;
	chevronCell: BoxProps;
	chevronLink: BoxProps;
	chevron: Omit<IconProps, "svg">;
}

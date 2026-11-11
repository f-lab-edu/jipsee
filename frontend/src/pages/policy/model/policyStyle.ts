import type {
	BoxProps,
	HStackProps,
	TextProps,
	VStackProps,
} from "@seed-design/react";

export interface PolicyScreenStyle {
	main: VStackProps;
	mobileBody: VStackProps;
	mobileTitle: TextProps;
	desktopBody: VStackProps;
	desktopColumn: VStackProps;
	desktopTitle: TextProps;
	desktopCard: VStackProps;
}

export interface PolicyContentStyle {
	draftNotice: BoxProps;
	draftNoticeText: TextProps;
	effectiveDate: TextProps;
	toc: VStackProps;
	tocList: VStackProps;
	tocLink: TextProps;
	clauses: VStackProps;
	clause: VStackProps;
	clauseTitle: TextProps;
	paragraph: TextProps;
	list: VStackProps;
	listItem: TextProps;
	rowsGroup: VStackProps;
	rowsHeading: TextProps;
	row: HStackProps;
	rowLabelCell: BoxProps;
	rowLabel: TextProps;
	rowValueCell: BoxProps;
	rowValue: TextProps;
	addendum: TextProps;
}

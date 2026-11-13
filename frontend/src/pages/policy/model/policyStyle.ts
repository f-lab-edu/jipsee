import type {
	BoxProps,
	GridProps,
	IconProps,
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
	draftNoticeIconCell: BoxProps;
	draftNoticeIcon: Omit<IconProps, "svg">;
	draftNoticeText: TextProps;
	effectiveDate: TextProps;
	effectiveDateBox: BoxProps;
	toc: BoxProps;
	tocList: GridProps;
	tocLink: BoxProps;
	tocNumberCell: BoxProps;
	tocNumber: TextProps;
	tocTitle: TextProps;
	clauses: VStackProps;
	clause: VStackProps;
	clauseTitle: TextProps;
	clauseBlocks: VStackProps;
	paragraph: TextProps;
	list: VStackProps;
	listItem: BoxProps;
	listItemText: TextProps;
	rowsGroup: VStackProps;
	rowsHeading: TextProps;
	rowsCard: BoxProps;
	row: GridProps;
	dividedRow: GridProps;
	rowLabel: TextProps;
	rowValue: TextProps;
	tableCards: VStackProps;
	tableWrapper: BoxProps;
	table: BoxProps;
	tableHeadRow: BoxProps;
	tableHeadCell: BoxProps;
	tableHeadText: TextProps;
	tableRow: BoxProps;
	tableRowHeadCell: BoxProps;
	tableRowHeadText: TextProps;
	tableCell: BoxProps;
	tableCellText: TextProps;
	addendum: TextProps;
	addendumBox: BoxProps;
}

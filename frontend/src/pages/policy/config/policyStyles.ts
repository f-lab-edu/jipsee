import type {
	PolicyContentStyle,
	PolicyScreenStyle,
} from "@/pages/policy/model/policyStyle";
import { typography } from "@/shared/config/typography";

export const policyScreenStyles: PolicyScreenStyle = {
	main: { flexGrow: 1 },
	mobileBody: {
		flexGrow: 1,
		gap: "x4",
		pt: "x5",
		px: "spacingX.globalGutter",
		pb: "x8",
		bg: "bg.layerDefault",
	},
	mobileTitle: {
		...typography.size18LineHeight24,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	desktopBody: { flexGrow: 1, alignItems: "center", px: "x6", py: "x10" },
	desktopColumn: { width: "480px", gap: "x4" },
	desktopTitle: {
		...typography.size26,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	desktopCard: {
		gap: "x5",
		p: "x6",
		bg: "bg.layerDefault",
		borderRadius: "r5",
		borderWidth: 1,
		borderColor: "stroke.neutralMuted",
	},
};

export const policyContentStyles: PolicyContentStyle = {
	draftNotice: {
		px: "x4",
		py: "x3_5",
		borderRadius: "r3",
		bg: "bg.informativeWeak",
	},
	draftNoticeText: { ...typography.size14, color: "fg.informativeContrast" },
	effectiveDate: { ...typography.size13, color: "fg.neutralMuted" },
	toc: {
		gap: "x2",
		p: "x4",
		borderWidth: 1,
		borderColor: "stroke.neutralWeak",
		borderRadius: "r3",
	},
	tocList: { gap: "x2" },
	tocLink: { ...typography.size14, color: "fg.neutral" },
	clauses: { gap: "x8" },
	// 조항 제목이 고정 헤더에 가리지 않도록 위쪽 스크롤 여백을 theme.css가 정함
	clause: { gap: "x3", className: "policy-clause" },
	clauseTitle: {
		...typography.size16,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	paragraph: { ...typography.size14, color: "fg.neutral" },
	list: { gap: "x1_5" },
	listItem: { ...typography.size14, color: "fg.neutral" },
	rowsGroup: {
		gap: "x2",
		p: "x3_5",
		borderRadius: "r3",
		bg: "bg.neutralWeak",
	},
	rowsHeading: {
		...typography.size14,
		fontWeight: "bold",
		color: "fg.neutral",
	},
	row: { gap: "x3", alignItems: "flex-start" },
	rowLabelCell: { width: "96px", flexShrink: 0 },
	rowLabel: { ...typography.size13, color: "fg.neutralMuted" },
	rowValueCell: { flexGrow: 1, minWidth: "0px" },
	rowValue: { ...typography.size14, color: "fg.neutral" },
	addendum: { ...typography.size13, color: "fg.neutralMuted" },
};

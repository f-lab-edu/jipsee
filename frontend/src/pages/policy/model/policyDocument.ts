export interface PolicyRow {
	label: string;
	value: string;
}

export interface PolicyRowGroup {
	heading: string;
	rows: readonly PolicyRow[];
}

export type PolicyBlock =
	| { kind: "paragraph"; text: string }
	| { kind: "list"; items: readonly string[] }
	| { kind: "rows"; heading?: string; rows: readonly PolicyRow[] }
	| { kind: "table"; headingLabel: string; groups: readonly PolicyRowGroup[] };

export interface PolicyClause {
	title: string;
	blocks: readonly PolicyBlock[];
}

export interface PolicyDocument {
	title: string;
	effectiveDate: string;
	clauses: readonly PolicyClause[];
	addendum?: string;
}

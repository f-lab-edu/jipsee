/** 케이스 id (예: S1-01) */
export function caseId(group: string, number: number) {
	return `${group}-${String(number).padStart(2, "0")}`;
}

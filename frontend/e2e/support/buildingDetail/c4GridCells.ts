import { type C4Row, WIDE_LABELS } from "./c4Info";

/** 2열 grid 배치 계산. 두 열 항목은 새 줄 전체를 차지하고 앞 줄이 반쯤 차 있으면 그 줄을 비워 둠 */
export function c4GridCells(rows: C4Row[]) {
	const cells: { col: number; row: number; wide: boolean }[] = [];
	let col = 0;
	let row = 0;
	for (const [label] of rows) {
		if (WIDE_LABELS.includes(label)) {
			if (col === 1) {
				row++;
				col = 0;
			}
			cells.push({ col: 0, row, wide: true });
			row++;
		} else {
			cells.push({ col, row, wide: false });
			col++;
			if (col === 2) {
				col = 0;
				row++;
			}
		}
	}
	return { cells, rowCount: col === 0 ? row : row + 1 };
}

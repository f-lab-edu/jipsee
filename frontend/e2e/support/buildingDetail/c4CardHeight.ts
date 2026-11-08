import { c4GridCells } from "./c4GridCells";
import type { C4Row } from "./c4Info";

/** 동 카드 높이: border 2 + padding 32 + (제목 22 + 간격 12) + 행 수 * 38 + 행 간격 12 */
export function c4CardHeight(rows: C4Row[], hasTitle: boolean) {
	const { rowCount } = c4GridCells(rows);
	return 2 + 32 + (hasTitle ? 34 : 0) + rowCount * 38 + (rowCount - 1) * 12;
}

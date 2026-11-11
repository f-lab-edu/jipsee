import type { DataSourceBaseMonthRow } from "@/entities/dataSource/api/dataSourceBaseMonthRow";
import { dataSourceInfos } from "@/entities/dataSource/config/dataSourceInfos";
import type { DataSourceCardItem } from "@/entities/dataSource/model/dataSourceCardItem";

/**
 * 데이터 출처 > 카드 목록 생성
 *
 * - 고정 값 목록 순서대로 카드 생성
 * - 숨김 출처는 응답에 행이 있어도 제외
 * - 응답에 행이 없는 출처는 기준 월 없이 생성
 * - 고정 값에 없는 출처의 행은 무시
 */
export function toDataSourceCards(
	rows: readonly DataSourceBaseMonthRow[],
): DataSourceCardItem[] {
	return dataSourceInfos
		.filter((info) => !info.hidden)
		.map(({ hidden: _hidden, ...info }) => ({
			...info,
			baseMonth:
				rows.find((row) => row.source === info.source)?.baseMonth ?? null,
		}));
}

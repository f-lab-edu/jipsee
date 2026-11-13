import { dataSourceBaseMonthsMock } from "@/entities/dataSource/api/dataSourceBaseMonthsMock";
import { toDataSourceCards } from "@/entities/dataSource/lib/toDataSourceCards";
import type { DataSourceCardItem } from "@/entities/dataSource/model/dataSourceCardItem";

/**
 * 데이터 출처 > 출처 카드 목록 조회
 *
 * - 백엔드가 없어 출처별 기준 월 목업을 고정 값과 합쳐 반환
 */
export async function getDataSourceCards(): Promise<DataSourceCardItem[]> {
	return toDataSourceCards(dataSourceBaseMonthsMock);
}

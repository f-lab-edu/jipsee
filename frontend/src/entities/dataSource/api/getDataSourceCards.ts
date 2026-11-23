import { dataSourceBaseMonthsMock } from "@/entities/dataSource/api/dataSourceBaseMonthsMock";
import type { DataSourceResponse } from "@/entities/dataSource/api/dataSourceResponse";
import { toDataSourceCards } from "@/entities/dataSource/lib/toDataSourceCards";
import type { DataSourceCardItem } from "@/entities/dataSource/model/dataSourceCardItem";
import type { ApiResponse } from "@/shared/api/apiResponse";
import { getFromBackend } from "@/shared/api/getFromBackend";
import { hasApiUrl } from "@/shared/api/hasApiUrl";

/**
 * 데이터 출처 > 출처 카드 목록 조회
 *
 * - API_URL이 있으면 백엔드의 출처별 기준 월(data 필드)을 고정 값과 합쳐 반환
 * - 2xx가 아닌 응답은 오류 발생
 * - API_URL이 없으면 백엔드 응답과 같은 형태의 출처별 기준 월 목업을 고정 값과 합쳐 반환
 */
export async function getDataSourceCards(): Promise<DataSourceCardItem[]> {
	if (!hasApiUrl()) {
		return toDataSourceCards(dataSourceBaseMonthsMock.data);
	}

	const response = await getFromBackend("/data-sources");

	if (!response.ok) {
		throw new Error(`데이터 출처 호출 실패: ${response.status}`);
	}

	const body: ApiResponse<DataSourceResponse[]> = await response.json();

	return toDataSourceCards(body.data);
}

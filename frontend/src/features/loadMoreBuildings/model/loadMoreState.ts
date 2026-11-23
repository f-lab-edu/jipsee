import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import type { LoadMoreStatus } from "@/features/loadMoreBuildings/model/loadMoreStatus";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type LoadMoreState = {
	buildings: BuildingSummary[];
	hasNext: boolean;
	// 다음에 요청할 0부터 시작하는 페이지 번호
	nextPage: number;
	status: LoadMoreStatus;
	// 마지막으로 새로 붙은 건물. sequence는 불러올 때마다 1씩 늘어 같은 건수도 다시 알리게 함
	added: Nullable<{ firstId: string; count: number; sequence: number }>;
};

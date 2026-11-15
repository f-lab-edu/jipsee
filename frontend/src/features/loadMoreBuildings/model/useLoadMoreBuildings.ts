"use client";

import { useCallback, useRef, useState } from "react";
import { fetchBuildingSearchPage } from "@/entities/building/api/fetchBuildingSearchPage";
import { toNewBuildings } from "@/entities/building/lib/toNewBuildings";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import type { LoadMoreState } from "@/features/loadMoreBuildings/model/loadMoreState";

interface UseLoadMoreBuildingsOptions {
	keyword: string;
	initialBuildings: BuildingSummary[];
	initialHasNext: boolean;
}

/**
 * 더 보기 > 건물 목록 상태
 *
 * - 처음 20건에서 시작해 loadMore를 부를 때마다 다음 페이지를 불러와 목록 끝에 추가
 * - 불러오는 중에는 loadMore를 다시 불러도 요청하지 않음
 * - 이미 불러온 건물과 번호가 같은 건물은 붙이지 않음
 * - 새로 붙은 건물이 있으면 첫 건물 번호와 건수를 added에 저장
 * - 실패하면 같은 페이지를 그대로 두고 오류 상태로 바꿈. 다시 부르면 같은 페이지를 요청
 *
 * @param keyword 검색어. 바뀌면 호출하는 쪽의 key 재생성 필요
 */
export function useLoadMoreBuildings({
	keyword,
	initialBuildings,
	initialHasNext,
}: UseLoadMoreBuildingsOptions) {
	const [state, setState] = useState<LoadMoreState>({
		buildings: initialBuildings,
		hasNext: initialHasNext,
		nextPage: 1,
		status: "idle",
		added: null,
	});
	const stateRef = useRef(state);
	stateRef.current = state;

	const loadMore = useCallback(async () => {
		const current = stateRef.current;

		if (current.status === "loading" || !current.hasNext) {
			return;
		}

		setState((previous) => ({ ...previous, status: "loading" }));

		try {
			const page = await fetchBuildingSearchPage(keyword, current.nextPage);

			setState((previous) => {
				const newBuildings = toNewBuildings(previous.buildings, page.buildings);
				const first = newBuildings[0];
				const next: LoadMoreState = {
					buildings: [...previous.buildings, ...newBuildings],
					hasNext: page.hasNext,
					nextPage: previous.nextPage + 1,
					status: "idle",
					added: previous.added,
				};

				if (first === undefined) {
					return next;
				}

				return {
					...next,
					added: {
						firstId: first.id,
						count: newBuildings.length,
						sequence: (previous.added?.sequence ?? 0) + 1,
					},
				};
			});
		} catch {
			setState((previous) => ({ ...previous, status: "error" }));
		}
	}, [keyword]);

	return { ...state, loadMore };
}

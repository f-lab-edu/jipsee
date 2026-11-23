import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchBuildingSearchPage } from "@/entities/building/api/fetchBuildingSearchPage";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import { useLoadMoreBuildings } from "@/features/loadMoreBuildings/model/useLoadMoreBuildings";

vi.mock("@/entities/building/api/fetchBuildingSearchPage", () => ({
	fetchBuildingSearchPage: vi.fn(),
}));

const fetchPage = vi.mocked(fetchBuildingSearchPage);

function toId(lot: number) {
	return `11440-망원동-${lot}-1`;
}

function createBuilding(lot: number): BuildingSummary {
	return {
		id: toId(lot),
		name: `건물 ${lot}`,
		lotAddress: `마포구 망원동 ${lot}-1`,
		roadAddress: null,
		latestNewJeonseMonth: null,
	};
}

function renderLoadMore() {
	return renderHook(() =>
		useLoadMoreBuildings({
			keyword: "망원동",
			initialBuildings: [createBuilding(1), createBuilding(2)],
			initialHasNext: true,
		}),
	);
}

describe("useLoadMoreBuildings", () => {
	beforeEach(() => {
		fetchPage.mockReset();
	});

	it("처음에는 받은 건물을 그대로 두고 idle임", () => {
		const { result } = renderLoadMore();

		expect(result.current.buildings).toHaveLength(2);
		expect(result.current.hasNext).toBe(true);
		expect(result.current.status).toBe("idle");
		expect(result.current.added).toBeNull();
	});

	it("더 불러오면 1번 페이지를 요청해 목록 끝에 붙이고 added에 첫 건물과 건수를 담음", async () => {
		fetchPage.mockResolvedValue({
			buildings: [createBuilding(3), createBuilding(4)],
			hasNext: true,
		});
		const { result } = renderLoadMore();

		await act(() => result.current.loadMore());

		expect(fetchPage).toHaveBeenCalledWith("망원동", 1);
		expect(result.current.buildings.map((building) => building.id)).toEqual([
			toId(1),
			toId(2),
			toId(3),
			toId(4),
		]);
		expect(result.current.added).toEqual({
			firstId: toId(3),
			count: 2,
			sequence: 1,
		});
		expect(result.current.status).toBe("idle");
	});

	it("이미 있는 건물은 붙이지 않고 건수에서도 뺌", async () => {
		fetchPage.mockResolvedValue({
			buildings: [createBuilding(2), createBuilding(3)],
			hasNext: false,
		});
		const { result } = renderLoadMore();

		await act(() => result.current.loadMore());

		expect(result.current.buildings.map((building) => building.id)).toEqual([
			toId(1),
			toId(2),
			toId(3),
		]);
		expect(result.current.added).toEqual({
			firstId: toId(3),
			count: 1,
			sequence: 1,
		});
	});

	it("응답의 hasNext가 false이면 hasNext를 false로 바꿈", async () => {
		fetchPage.mockResolvedValue({
			buildings: [createBuilding(3)],
			hasNext: false,
		});
		const { result } = renderLoadMore();

		await act(() => result.current.loadMore());

		expect(result.current.hasNext).toBe(false);
	});

	it("연달아 더 불러오면 다음 페이지를 요청하고 sequence를 올림", async () => {
		fetchPage
			.mockResolvedValueOnce({ buildings: [createBuilding(3)], hasNext: true })
			.mockResolvedValueOnce({
				buildings: [createBuilding(4)],
				hasNext: false,
			});
		const { result } = renderLoadMore();

		await act(() => result.current.loadMore());
		await act(() => result.current.loadMore());

		expect(fetchPage).toHaveBeenNthCalledWith(2, "망원동", 2);
		expect(result.current.added).toEqual({
			firstId: toId(4),
			count: 1,
			sequence: 2,
		});
	});

	it("불러오는 중에 다시 부르면 요청하지 않음", async () => {
		fetchPage.mockReturnValue(new Promise(() => {}));
		const { result } = renderLoadMore();

		await act(async () => {
			void result.current.loadMore();
		});
		await act(async () => {
			void result.current.loadMore();
		});

		expect(result.current.status).toBe("loading");
		expect(fetchPage).toHaveBeenCalledTimes(1);
	});

	it("실패하면 error로 바꾸고 다시 부르면 같은 페이지를 요청함", async () => {
		fetchPage.mockRejectedValueOnce(new Error("실패"));
		fetchPage.mockResolvedValueOnce({
			buildings: [createBuilding(3)],
			hasNext: false,
		});
		const { result } = renderLoadMore();

		await act(() => result.current.loadMore());

		expect(result.current.status).toBe("error");
		expect(result.current.buildings).toHaveLength(2);

		await act(() => result.current.loadMore());

		expect(fetchPage).toHaveBeenNthCalledWith(1, "망원동", 1);
		expect(fetchPage).toHaveBeenNthCalledWith(2, "망원동", 1);
		expect(result.current.status).toBe("idle");
		expect(result.current.buildings).toHaveLength(3);
	});

	it("다음 페이지가 없으면 요청하지 않음", async () => {
		const { result } = renderHook(() =>
			useLoadMoreBuildings({
				keyword: "망원동",
				initialBuildings: [createBuilding(1)],
				initialHasNext: false,
			}),
		);

		await act(() => result.current.loadMore());

		expect(fetchPage).not.toHaveBeenCalled();
	});
});

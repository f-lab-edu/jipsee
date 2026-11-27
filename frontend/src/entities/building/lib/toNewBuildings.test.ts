import { describe, expect, it } from "vitest";
import { toNewBuildings } from "@/entities/building/lib/toNewBuildings";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";

function createBuilding(lot: number): BuildingSummary {
	return {
		id: `11440-망원동-${lot}-1`,
		name: null,
		lotAddress: `마포구 망원동 ${lot}-1`,
		latestNewJeonseMonth: null,
	};
}

describe("toNewBuildings", () => {
	it("이미 불러온 건물과 번호가 같은 건물은 뺌", () => {
		const loaded = [createBuilding(1), createBuilding(2)];
		const incoming = [createBuilding(2), createBuilding(3)];

		expect(toNewBuildings(loaded, incoming)).toEqual([createBuilding(3)]);
	});

	it("겹치는 건물이 없으면 받은 건물을 순서대로 모두 반환함", () => {
		const incoming = [createBuilding(4), createBuilding(3)];

		expect(toNewBuildings([createBuilding(1)], incoming)).toEqual(incoming);
	});

	it("받은 건물이 모두 이미 있으면 빈 배열을 반환함", () => {
		const loaded = [createBuilding(1)];

		expect(toNewBuildings(loaded, [createBuilding(1)])).toEqual([]);
	});
});

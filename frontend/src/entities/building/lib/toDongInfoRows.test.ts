import { describe, expect, it } from "vitest";
import { toDongInfoRows } from "@/entities/building/lib/toDongInfoRows";
import type { BuildingDong } from "@/entities/building/model/buildingDong";

const fullDong: BuildingDong = {
	name: "가동",
	useApprovalYear: 2003,
	householdCount: 12,
	floorCount: 5,
	totalFloorArea: 842.5,
	structureName: "철근콘크리트구조",
	earthquakeDesignApplied: true,
	elevatorCount: 1,
	selfPropelledParkingIndoorCount: 6,
	selfPropelledParkingOutdoorCount: 2,
	etcPurpose: "다세대주택",
};

function findValue(dong: BuildingDong, label: string) {
	return toDongInfoRows(dong).find((row) => row.label === label)?.value;
}

describe("toDongInfoRows", () => {
	it("모든 값이 있으면 정해진 순서로 항목을 만듦", () => {
		expect(toDongInfoRows(fullDong).map((row) => row.label)).toEqual([
			"사용승인",
			"세대수",
			"층수",
			"연면적",
			"구조",
			"내진설계",
			"승강기",
			"주차 대수",
			"기타용도",
		]);
	});

	it("세대수가 0이거나 구조가 null이면 그 항목을 만들지 않음", () => {
		const dong = { ...fullDong, householdCount: 0, structureName: null };
		const labels = toDongInfoRows(dong).map((row) => row.label);

		expect(labels).not.toContain("세대수");
		expect(labels).not.toContain("구조");
	});

	it("승강기가 0이면 없음, 1 이상이면 대수, null이면 항목을 만들지 않음", () => {
		expect(findValue({ ...fullDong, elevatorCount: 0 }, "승강기")).toBe("없음");
		expect(findValue({ ...fullDong, elevatorCount: 2 }, "승강기")).toBe("2대");
		expect(findValue({ ...fullDong, elevatorCount: null }, "승강기")).toBe(
			undefined,
		);
	});

	it("내진설계가 true이면 적용, false이면 미적용, null이면 항목을 만들지 않음", () => {
		expect(
			findValue({ ...fullDong, earthquakeDesignApplied: true }, "내진설계"),
		).toBe("적용");
		expect(
			findValue({ ...fullDong, earthquakeDesignApplied: false }, "내진설계"),
		).toBe("미적용");
		expect(
			findValue({ ...fullDong, earthquakeDesignApplied: null }, "내진설계"),
		).toBe(undefined);
	});

	it("주차 대수에서 0이거나 null인 쪽은 문구에서 뺌", () => {
		const outdoorOnly = {
			...fullDong,
			selfPropelledParkingIndoorCount: 0,
			selfPropelledParkingOutdoorCount: 3,
		};
		const indoorOnly = {
			...fullDong,
			selfPropelledParkingIndoorCount: 4,
			selfPropelledParkingOutdoorCount: null,
		};

		expect(findValue(fullDong, "주차 대수")).toBe("자주식 옥내 6대, 옥외 2대");
		expect(findValue(outdoorOnly, "주차 대수")).toBe("자주식 옥외 3대");
		expect(findValue(indoorOnly, "주차 대수")).toBe("자주식 옥내 4대");
	});

	it("주차 대수가 둘 다 0이거나 null이면 항목을 만들지 않음", () => {
		const dong = {
			...fullDong,
			selfPropelledParkingIndoorCount: 0,
			selfPropelledParkingOutdoorCount: null,
		};

		expect(findValue(dong, "주차 대수")).toBe(undefined);
	});

	it("두 열을 차지하는 항목은 주차 대수와 기타용도뿐임", () => {
		const wideLabels = toDongInfoRows(fullDong)
			.filter((row) => row.spansTwoColumns)
			.map((row) => row.label);

		expect(wideLabels).toEqual(["주차 대수", "기타용도"]);
	});

	it("연면적은 소수 첫째 자리까지 표시함", () => {
		expect(findValue({ ...fullDong, totalFloorArea: 612 }, "연면적")).toBe(
			"612.0㎡",
		);
	});
});

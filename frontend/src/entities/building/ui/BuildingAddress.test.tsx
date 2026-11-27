import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingAddress from "@/entities/building/ui/BuildingAddress";

const building: BuildingSummary = {
	id: "11440-망원동-12-3",
	name: "망원빌라",
	lotAddress: "마포구 망원동 12-3",
	latestNewJeonseMonth: null,
};

describe("BuildingAddress", () => {
	it("건물명이 있으면 지번 줄을 출력함", () => {
		const { container } = render(
			<BuildingAddress building={building} variant="mobile" />,
		);

		expect(container.textContent).toBe("지번마포구 망원동 12-3");
	});

	it("건물명이 없으면 아무것도 출력하지 않음", () => {
		const { container } = render(
			<BuildingAddress
				building={{ ...building, name: null }}
				variant="desktop"
			/>,
		);

		expect(container.firstChild).toBeNull();
	});
});

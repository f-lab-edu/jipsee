import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingAddress from "@/entities/building/ui/BuildingAddress";

const building: BuildingSummary = {
	id: 1,
	name: "망원빌라",
	lotAddress: "마포구 망원동 12-3",
	roadAddress: "마포구 월드컵로25길 12",
	useApprovalYear: 2003,
	latestNewJeonseMonth: null,
};

describe("BuildingAddress", () => {
	it("건물명과 도로명 주소가 있으면 지번 줄 뒤에 도로명 줄을 출력함", () => {
		const { container } = render(
			<BuildingAddress building={building} variant="mobile" />,
		);

		expect(container.textContent).toBe(
			"지번마포구 망원동 12-3도로명마포구 월드컵로25길 12",
		);
	});

	it("도로명 주소가 없으면 지번 줄만 출력함", () => {
		render(
			<BuildingAddress
				building={{ ...building, roadAddress: null }}
				variant="mobile"
			/>,
		);

		expect(screen.getByText("지번")).toBeTruthy();
		expect(screen.queryByText("도로명")).toBeNull();
	});

	it("건물명이 없으면 지번 줄 없이 도로명 줄만 출력함", () => {
		render(
			<BuildingAddress
				building={{ ...building, name: null }}
				variant="desktop"
			/>,
		);

		expect(screen.queryByText("지번")).toBeNull();
		expect(screen.getByText("도로명")).toBeTruthy();
	});

	it("건물명과 도로명 주소가 모두 없으면 아무것도 출력하지 않음", () => {
		const { container } = render(
			<BuildingAddress
				building={{ ...building, name: null, roadAddress: null }}
				variant="desktop"
			/>,
		);

		expect(container.firstChild).toBeNull();
	});
});

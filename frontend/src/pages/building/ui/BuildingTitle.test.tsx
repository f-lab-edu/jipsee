import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BuildingTitle from "@/pages/building/ui/BuildingTitle";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ back: vi.fn() }),
}));

describe("BuildingTitle", () => {
	it("건물명이 있으면 h1은 하나이고 건물명이며 주소를 함께 출력함", () => {
		render(<BuildingTitle name="망원빌라" address="마포구 망원동 12-3" />);

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
		expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
			"망원빌라",
		);
		expect(screen.getByText("마포구 망원동 12-3")).toBeTruthy();
	});

	it("건물명이 없으면 h1은 하나이고 주소이며 주소를 따로 출력하지 않음", () => {
		render(<BuildingTitle name={null} address="마포구 망원동 16-2" />);

		expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
		expect(screen.getAllByText("마포구 망원동 16-2")).toHaveLength(1);
	});
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";
import { nearbyFilterLabels } from "@/features/filterNearbyDeals/config/nearbyFilterLabels";
import NearbyDealsFilterGroup from "@/features/filterNearbyDeals/ui/NearbyDealsFilterGroup";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

vi.stubGlobal(
	"ResizeObserver",
	class {
		observe() {}
		unobserve() {}
		disconnect() {}
	},
);

function renderPeriodGroup() {
	render(
		<NearbyDealsFilterGroup
			layout="mobile"
			buildingId="11440-망원동-12-3"
			condition={{ period: 12, type: "jeonse" }}
			name="period"
			label="기간"
			options={nearbyDealsOptions.periods}
			optionLabels={nearbyFilterLabels.options.period}
		/>,
	);
}

describe("NearbyDealsFilterGroup", () => {
	it("현재 조건 값을 선택 상자에 보여 줌", () => {
		renderPeriodGroup();

		expect(
			screen.getByRole("combobox", { name: "기간" }).textContent,
		).toContain("12개월");
	});

	it("다른 값을 고르면 바뀐 조건의 주소로 스크롤 없이 이동함", () => {
		push.mockClear();
		renderPeriodGroup();

		fireEvent.click(screen.getByRole("combobox", { name: "기간" }));
		fireEvent.click(screen.getByRole("option", { name: "24개월" }));

		expect(push).toHaveBeenCalledWith(
			"/buildings/11440-%EB%A7%9D%EC%9B%90%EB%8F%99-12-3?period=24&type=jeonse",
			{
				scroll: false,
			},
		);
	});

	it("현재 값을 다시 고르면 이동하지 않음", () => {
		push.mockClear();
		renderPeriodGroup();

		fireEvent.click(screen.getByRole("combobox", { name: "기간" }));
		fireEvent.click(screen.getByRole("option", { name: "12개월" }));

		expect(push).not.toHaveBeenCalled();
	});
});

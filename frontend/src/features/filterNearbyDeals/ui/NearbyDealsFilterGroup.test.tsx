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

function renderRadiusGroup() {
	render(
		<NearbyDealsFilterGroup
			layout="mobile"
			buildingId={1}
			condition={{ radius: 500, period: 12, type: "jeonse" }}
			name="radius"
			label="반경"
			options={nearbyDealsOptions.radii}
			optionLabels={nearbyFilterLabels.options.radius}
		/>,
	);
}

describe("NearbyDealsFilterGroup", () => {
	it("현재 조건 값을 선택 상자에 보여 줌", () => {
		renderRadiusGroup();

		expect(
			screen.getByRole("combobox", { name: "반경" }).textContent,
		).toContain("500m");
	});

	it("다른 값을 고르면 바뀐 조건의 주소로 스크롤 없이 이동함", () => {
		push.mockClear();
		renderRadiusGroup();

		fireEvent.click(screen.getByRole("combobox", { name: "반경" }));
		fireEvent.click(screen.getByRole("option", { name: "1km" }));

		expect(push).toHaveBeenCalledWith(
			"/buildings/1?radius=1000&period=12&type=jeonse",
			{ scroll: false },
		);
	});

	it("현재 값을 다시 고르면 이동하지 않음", () => {
		push.mockClear();
		renderRadiusGroup();

		fireEvent.click(screen.getByRole("combobox", { name: "반경" }));
		fireEvent.click(screen.getByRole("option", { name: "500m" }));

		expect(push).not.toHaveBeenCalled();
	});
});

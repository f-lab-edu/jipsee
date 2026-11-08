import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BackButton from "@/shared/ui/BackButton";

const back = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ back }),
}));

describe("BackButton", () => {
	it("누르면 이전 화면으로 이동함", () => {
		render(
			<BackButton style={{}}>
				<span>아이콘</span>
			</BackButton>,
		);

		fireEvent.click(screen.getByRole("button", { name: "뒤로 가기" }));

		expect(back).toHaveBeenCalledTimes(1);
	});
});

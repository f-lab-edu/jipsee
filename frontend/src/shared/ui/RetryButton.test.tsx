import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RetryButton from "@/shared/ui/RetryButton";

const router = vi.hoisted(() => ({ refresh: vi.fn() }));

vi.mock("next/navigation", () => ({
	useRouter: () => router,
}));

describe("RetryButton", () => {
	it("누르면 서버 데이터를 다시 요청하고 오류 경계의 reset도 호출함", () => {
		const reset = vi.fn();
		render(<RetryButton style={{}} textStyle={{}} reset={reset} />);

		fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

		expect(router.refresh).toHaveBeenCalledTimes(1);
		expect(reset).toHaveBeenCalledTimes(1);
	});

	it("reset이 없으면 서버 데이터를 다시 요청만 함", () => {
		router.refresh.mockClear();
		render(<RetryButton style={{}} textStyle={{}} />);

		fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

		expect(router.refresh).toHaveBeenCalledTimes(1);
	});
});

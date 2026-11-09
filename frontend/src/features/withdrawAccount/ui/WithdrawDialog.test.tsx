import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import WithdrawButton from "@/features/withdrawAccount/ui/WithdrawButton";

describe("WithdrawDialog", () => {
	beforeAll(() => {
		window.matchMedia = (query) =>
			({
				matches: false,
				media: query,
				addEventListener: () => {},
				removeEventListener: () => {},
			}) as unknown as MediaQueryList;
	});

	it("폼을 제출하면 탈퇴하기 버튼을 비활성화함", () => {
		render(<WithdrawButton />);
		fireEvent.click(screen.getByRole("button", { name: "회원 탈퇴" }));
		const confirm = screen.getByRole("button", { name: "탈퇴하기" });

		expect(confirm.hasAttribute("disabled")).toBe(false);

		fireEvent.submit(confirm.closest("form") as HTMLFormElement);

		expect(confirm.hasAttribute("disabled")).toBe(true);
	});
});

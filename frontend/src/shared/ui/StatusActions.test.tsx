import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { statusStyles } from "@/shared/config/statusStyles";
import StatusActions from "@/shared/ui/StatusActions";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ refresh: vi.fn() }),
}));

describe("StatusActions", () => {
	it("404는 홈으로 가기 링크만 출력함", () => {
		render(<StatusActions kind="notFound" style={statusStyles.mobile} />);

		expect(screen.getByRole("link", { name: "홈으로 가기" })).toHaveProperty(
			"pathname",
			"/",
		);
		expect(screen.queryByRole("button")).toBeNull();
	});

	it.each(["error", "rateLimited"] as const)(
		"%s는 다시 시도 버튼과 홈으로 가기 링크를 출력함",
		(kind) => {
			render(<StatusActions kind={kind} style={statusStyles.mobile} />);

			expect(screen.getByRole("button", { name: "다시 시도" })).toBeTruthy();
			expect(screen.getByRole("link", { name: "홈으로 가기" })).toBeTruthy();
		},
	);
});

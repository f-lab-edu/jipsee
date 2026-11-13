import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AccountLink from "@/widgets/header/ui/AccountLink";

describe("AccountLink", () => {
	it("세션이 있으면 /me로 가는 내 정보 링크를 표시하고 로그인 링크는 표시하지 않음", () => {
		render(<AccountLink session={{ provider: "GOOGLE" }} currentPath="/" />);

		expect(screen.getByRole("link", { name: "내 정보" })).toHaveProperty(
			"pathname",
			"/me",
		);
		expect(screen.queryByText("로그인")).toBeNull();
	});

	it("현재 경로가 /me이면 내 정보 링크에 aria-current가 page로 붙고 다른 경로이면 붙지 않음", () => {
		const { rerender } = render(
			<AccountLink session={{ provider: "GOOGLE" }} currentPath="/me" />,
		);

		expect(
			screen
				.getByRole("link", { name: "내 정보" })
				.getAttribute("aria-current"),
		).toBe("page");

		rerender(<AccountLink session={{ provider: "GOOGLE" }} currentPath="/" />);

		expect(
			screen
				.getByRole("link", { name: "내 정보" })
				.hasAttribute("aria-current"),
		).toBe(false);
	});

	it("세션이 없으면 현재 경로를 next로 담은 /login 링크를 표시함", () => {
		render(
			<AccountLink
				session={null}
				currentPath="/search?keyword=%EB%85%B8%EC%9B%90%26x"
			/>,
		);

		expect(
			screen.getByRole("link", { name: "로그인" }).getAttribute("href"),
		).toBe(
			"/login?next=%2Fsearch%3Fkeyword%3D%25EB%2585%25B8%25EC%259B%2590%2526x",
		);
		expect(screen.queryByText("내 정보")).toBeNull();
	});
});

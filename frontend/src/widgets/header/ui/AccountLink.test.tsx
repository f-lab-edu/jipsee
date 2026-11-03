import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import AccountLink from "@/widgets/header/ui/AccountLink";

afterEach(cleanup);

describe("AccountLink", () => {
	it("세션이 있으면 /me로 가는 내 정보 링크를 표시하고 로그인 링크는 표시하지 않음", () => {
		render(<AccountLink session={{ provider: "GOOGLE" }} />);

		expect(screen.getByRole("link", { name: "내 정보" })).toHaveProperty(
			"pathname",
			"/me",
		);
		expect(screen.queryByText("로그인")).toBeNull();
	});

	it("세션이 없으면 /login으로 가는 로그인 링크를 표시함", () => {
		render(<AccountLink session={null} />);

		expect(screen.getByRole("link", { name: "로그인" })).toHaveProperty(
			"pathname",
			"/login",
		);
		expect(screen.queryByText("내 정보")).toBeNull();
	});
});

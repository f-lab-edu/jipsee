import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Header from "@/widgets/header/ui/Header";

afterEach(cleanup);

describe("Header", () => {
	it("서비스 이름을 홈으로 가는 링크로 표시함", () => {
		render(<Header session={null} />);

		expect(screen.getByRole("link", { name: "집씨" })).toHaveProperty(
			"pathname",
			"/",
		);
	});
});

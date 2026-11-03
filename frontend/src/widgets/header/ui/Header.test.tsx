import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/widgets/header/ui/Header";

describe("Header", () => {
	it("모바일 헤더에 서비스 이름을 홈으로 가는 링크로 표시함", () => {
		render(<Header session={null} mobileBackground="bg.layerDefault" />);

		expect(
			within(screen.getByTestId("header-mobile")).getByRole("link", {
				name: "집씨 홈",
			}),
		).toHaveProperty("pathname", "/");
	});

	it("데스크톱 헤더에도 같은 홈 링크를 표시함", () => {
		render(<Header session={null} mobileBackground="bg.layerDefault" />);

		expect(
			within(screen.getByTestId("header-desktop")).getByRole("link", {
				name: "집씨 홈",
			}),
		).toHaveProperty("pathname", "/");
	});

	it("사용처가 넘긴 배경 색을 모바일 헤더에 적용함", () => {
		render(<Header session={null} mobileBackground="bg.brandWeak" />);

		const row = screen.getByTestId("header-mobile").firstElementChild;

		expect(row?.getAttribute("style")).toContain(
			"--seed-box-background: var(--seed-color-bg-brand-weak)",
		);
	});
});

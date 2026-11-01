import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "@/widgets/header/ui/Header";

describe("Header", () => {
	it("서비스 이름을 홈으로 가는 링크로 표시함", () => {
		render(<Header session={null} background="bg.layerDefault" />);

		expect(screen.getByRole("link", { name: "집씨" })).toHaveProperty(
			"pathname",
			"/",
		);
	});

	it("사용처가 넘긴 배경 색을 헤더에 적용함", () => {
		render(<Header session={null} background="bg.brandWeak" />);

		const content = screen.getByRole("banner").firstElementChild as HTMLElement;

		expect(content.style.getPropertyValue("--seed-box-background")).toBe(
			"var(--seed-color-bg-brand-weak)",
		);
	});
});

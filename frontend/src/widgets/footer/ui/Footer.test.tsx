import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/widgets/footer/ui/Footer";

describe("Footer", () => {
	it("모바일 푸터에 데이터 출처, 이용약관, 개인정보처리방침 링크를 순서대로 표시함", () => {
		render(<Footer />);

		const links = within(screen.getByTestId("footer-mobile")).getAllByRole(
			"link",
		);

		expect(
			links.map((link) => [link.textContent, link.getAttribute("href")]),
		).toEqual([
			["데이터 출처", "/policies/data-sources"],
			["이용약관", "/policies/terms"],
			["개인정보처리방침", "/policies/privacy"],
		]);
	});

	it("데스크톱 푸터에도 같은 링크를 같은 순서로 표시함", () => {
		render(<Footer />);

		const links = within(screen.getByTestId("footer-desktop")).getAllByRole(
			"link",
		);

		expect(links.map((link) => link.getAttribute("href"))).toEqual([
			"/policies/data-sources",
			"/policies/terms",
			"/policies/privacy",
		]);
	});
});

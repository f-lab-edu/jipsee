import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/widgets/footer/ui/Footer";

describe("Footer", () => {
	it("데이터 출처, 이용약관, 개인정보처리방침 링크를 순서대로 표시함", () => {
		render(<Footer />);

		const links = screen.getAllByRole("link");

		expect(
			links.map((link) => [link.textContent, link.getAttribute("href")]),
		).toEqual([
			["데이터 출처", "/policies/data-sources"],
			["이용약관", "/policies/terms"],
			["개인정보처리방침", "/policies/privacy"],
		]);
	});
});

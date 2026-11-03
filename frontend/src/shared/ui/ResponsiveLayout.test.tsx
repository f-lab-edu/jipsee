import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

describe("ResponsiveLayout", () => {
	it("모바일 레이아웃을 testId에 -mobile을 붙인 요소 안에 출력함", () => {
		render(
			<ResponsiveLayout
				testId="sample"
				mobile={<p>모바일 내용</p>}
				desktop={<p>데스크톱 내용</p>}
			/>,
		);

		expect(
			within(screen.getByTestId("sample-mobile")).getByText("모바일 내용"),
		).toBeTruthy();
		expect(
			within(screen.getByTestId("sample-mobile")).queryByText("데스크톱 내용"),
		).toBeNull();
	});

	it("데스크톱 레이아웃을 testId에 -desktop을 붙인 요소 안에 출력함", () => {
		render(
			<ResponsiveLayout
				testId="sample"
				mobile={<p>모바일 내용</p>}
				desktop={<p>데스크톱 내용</p>}
			/>,
		);

		expect(
			within(screen.getByTestId("sample-desktop")).getByText("데스크톱 내용"),
		).toBeTruthy();
		expect(
			within(screen.getByTestId("sample-desktop")).queryByText("모바일 내용"),
		).toBeNull();
	});
});

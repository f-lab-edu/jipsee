import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BaseMonthNotice from "@/widgets/searchGuide/ui/BaseMonthNotice";
import SearchGuide from "@/widgets/searchGuide/ui/SearchGuide";

describe("SearchGuide", () => {
	it("기준 월이 있으면 기준 월 줄과 일부 누락 줄을 출력함", () => {
		render(<SearchGuide baseMonth={{ year: 2026, month: 9 }} />);

		expect(screen.getAllByText("2026년 9월 실거래 정보")).toHaveLength(2);
		expect(screen.getAllByText(/최근 1~2개월 거래는/)).toHaveLength(2);
	});

	it("기준 월이 없으면 기준 월 줄은 숨기고 일부 누락 줄만 출력함", () => {
		render(<SearchGuide baseMonth={null} />);

		expect(screen.queryByText(/실거래 정보/)).toBeNull();
		expect(screen.queryByText(/까지 수집되어 있어요/)).toBeNull();
		expect(screen.getAllByText(/최근 1~2개월 거래는/)).toHaveLength(2);
	});
});

describe("BaseMonthNotice", () => {
	it("기준 월이 없으면 기준 월 줄은 숨기고 일부 누락 줄만 출력함", () => {
		render(<BaseMonthNotice testId="notice" baseMonth={null} />);

		expect(screen.queryByText(/실거래 정보/)).toBeNull();
		expect(screen.queryByText(/까지 수집되어 있어요/)).toBeNull();
		expect(screen.getAllByText(/최근 1~2개월 거래는/)).toHaveLength(2);
	});
});

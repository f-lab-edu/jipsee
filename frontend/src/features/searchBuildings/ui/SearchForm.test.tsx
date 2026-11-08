import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";

function submitWith(value: string) {
	render(<SearchForm defaultValue="" variant="intro" invalid={false} />);

	fireEvent.change(screen.getByLabelText("건물 검색"), {
		target: { value },
	});

	return fireEvent.submit(screen.getByRole("search"));
}

describe("SearchForm", () => {
	it("검색어가 비어 있으면 제출하지 않음", () => {
		expect(submitWith("")).toBe(false);
	});

	it("공백만 입력하고 제출하면 제출하지 않음", () => {
		expect(submitWith("   ")).toBe(false);
	});

	it("검색어를 입력하고 제출하면 제출을 막지 않음", () => {
		expect(submitWith("망원동")).toBe(true);
	});
});

import { describe, expect, it } from "vitest";
import { toTypographyValue } from "@/shared/lib/responsiveTypography/toTypographyValue";

describe("toTypographyValue", () => {
	it("글자 크기 토큰은 Seed 글자 크기 변수로 바꿈", () => {
		expect(toTypographyValue("t9", "font-size")).toBe(
			"var(--seed-font-size-t9)",
		);
	});

	it("줄 높이 토큰은 Seed 줄 높이 변수로 바꿈", () => {
		expect(toTypographyValue("t11", "line-height")).toBe(
			"var(--seed-line-height-t11)",
		);
	});

	it("px 값은 그대로 반환함", () => {
		expect(toTypographyValue("34px", "font-size")).toBe("34px");
	});
});

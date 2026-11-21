import { describe, expect, it } from "vitest";
import { typography } from "@/shared/config/typography";
import { toResponsiveTypography } from "@/shared/lib/responsiveTypography/toResponsiveTypography";

describe("toResponsiveTypography", () => {
	it("lg 미만과 lg 이상의 글자 크기와 줄 높이를 CSS 변수로 반환함", () => {
		const { className, style } = toResponsiveTypography(
			typography.size24,
			typography.size34,
		);

		expect(className).toBe("responsive-text");
		expect(style).toEqual({
			"--responsive-font-size": "var(--seed-font-size-t9)",
			"--responsive-line-height": "var(--seed-line-height-t9)",
			"--responsive-font-size-lg": "34px",
			"--responsive-line-height-lg": "44px",
		});
	});
});

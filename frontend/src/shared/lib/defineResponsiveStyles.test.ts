import { describe, expect, it } from "vitest";
import { typography } from "@/shared/config/typography";
import { defineResponsiveStyles } from "@/shared/lib/defineResponsiveStyles";
import type { TextStyle } from "@/shared/model/textStyle";

describe("defineResponsiveStyles", () => {
	it("받은 스타일 객체를 그대로 반환함", () => {
		const styles = { mobile: typography.size12, desktop: typography.size13 };

		expect(defineResponsiveStyles<TextStyle>(styles)).toBe(styles);
	});

	it("desktop 스타일이 없으면 타입 오류가 발생함", () => {
		// @ts-expect-error desktop 키가 없음
		defineResponsiveStyles<TextStyle>({ mobile: typography.size12 });
	});
});

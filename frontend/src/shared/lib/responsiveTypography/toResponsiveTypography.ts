import type { CSSProperties } from "react";
import type { TextStyle } from "@/shared/config/typography";
import { toTypographyValue } from "@/shared/lib/responsiveTypography/toTypographyValue";

/**
 * 반응형 글자 크기
 *
 * - Text의 fontSize와 lineHeight가 반응형 값을 받지 않아 theme.css의 `.responsive-text`가 읽는 CSS 변수로 전달
 * - base는 lg 미만, lg는 1280 이상에 적용
 * - 반환한 className과 style을 Text에 펼쳐 쓰고 fontSize와 lineHeight는 따로 넘기지 않음
 */
export function toResponsiveTypography(
	base: Required<TextStyle>,
	lg: Required<TextStyle>,
) {
	const style = {
		"--responsive-font-size": toTypographyValue(base.fontSize, "font-size"),
		"--responsive-line-height": toTypographyValue(
			base.lineHeight,
			"line-height",
		),
		"--responsive-font-size-lg": toTypographyValue(lg.fontSize, "font-size"),
		"--responsive-line-height-lg": toTypographyValue(
			lg.lineHeight,
			"line-height",
		),
	} as CSSProperties;

	return { className: "responsive-text", style };
}

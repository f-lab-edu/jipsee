import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

/**
 * 반응형 스타일 > 정의
 *
 * - mobile과 desktop 스타일이 모두 있어야 함
 * - 두 스타일을 Style 타입으로 검사함
 */
export function defineResponsiveStyles<Style>(
	styles: Record<ResponsiveVariant, Style>,
) {
	return styles;
}

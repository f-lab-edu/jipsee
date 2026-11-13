import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

/**
 * 정책 > 조항 앵커 id 생성
 *
 * - 모바일과 데스크톱을 함께 렌더링하므로 화면 크기 접미사를 붙임
 *
 * @param order 1부터 시작하는 조항 순번
 */
export function toClauseId(layout: ResponsiveVariant, order: number): string {
	return `clause-${order}-${layout}`;
}

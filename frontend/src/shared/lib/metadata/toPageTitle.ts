import { siteMetadata } from "@/shared/config/siteMetadata";

/**
 * 메타데이터 > 페이지 제목 변환
 *
 * - 제목 템플릿에 화면 제목을 넣은 값 반환
 */
export function toPageTitle(title: string): string {
	return siteMetadata.titleTemplate.replace("%s", title);
}

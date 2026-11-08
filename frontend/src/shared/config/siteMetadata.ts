const name = "집씨";

/**
 * 사이트 메타데이터
 *
 * - 서비스 이름처럼 여러 화면에서 같이 쓰는 값 보관
 */
export const siteMetadata = {
	name,
	description:
		"연립, 다세대 전월세 실거래와 건축물대장을 공공데이터 그대로 보여줘요",
	locale: "ko_KR",
	twitterCard: "summary_large_image",
	titleTemplate: `%s | ${name}`,
} as const;

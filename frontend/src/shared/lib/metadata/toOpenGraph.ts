import type { Metadata } from "next";
import { siteMetadata } from "@/shared/config/siteMetadata";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * 메타데이터 > 오픈 그래프 변환
 *
 * - 사이트 공통 값에 제목을 더한 오픈 그래프 반환
 */
export function toOpenGraph(title: string): OpenGraph {
	return {
		siteName: siteMetadata.name,
		locale: siteMetadata.locale,
		type: "website",
		title,
		description: siteMetadata.description,
	};
}

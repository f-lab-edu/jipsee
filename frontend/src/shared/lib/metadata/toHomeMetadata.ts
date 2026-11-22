import type { Metadata, ResolvingMetadata } from "next";
import { siteMetadata } from "@/shared/config/siteMetadata";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 메타데이터 > 홈 메타데이터 변환
 *
 * - 제목 키를 빼서 루트 기본값(집씨)을 쓰고 오픈 그래프 제목만 사이트 이름으로 지정
 * - 대표 주소(canonical)와 og:url은 홈 경로
 */
export async function toHomeMetadata(
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { title, openGraph, ...metadata } = await toPageMetadata(
		siteMetadata.name,
		parent,
		paths.home,
	);

	return {
		...metadata,
		openGraph: { ...openGraph, title: siteMetadata.name },
	};
}

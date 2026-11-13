import type { Metadata, ResolvingMetadata } from "next";
import { siteMetadata } from "@/shared/config/siteMetadata";
import { toOpenGraph } from "@/shared/lib/metadata/toOpenGraph";
import { toPageTitle } from "@/shared/lib/metadata/toPageTitle";

/**
 * 메타데이터 > 페이지 메타데이터 변환
 *
 * - 화면 제목을 제목과 오픈 그래프 제목에 사용
 * - 페이지가 openGraph와 twitter를 지정하면 루트 값이 통째로 대체되므로 루트의 이미지를 다시 채움
 */
export async function toPageMetadata(
	title: string,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { openGraph, twitter } = await parent;

	return {
		title,
		openGraph: {
			...toOpenGraph(toPageTitle(title)),
			images: openGraph?.images,
		},
		twitter: {
			card: siteMetadata.twitterCard,
			images: twitter?.images,
		},
	};
}

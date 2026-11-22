import type { Metadata, ResolvingMetadata } from "next";
import { siteMetadata } from "@/shared/config/siteMetadata";
import { toOpenGraph } from "@/shared/lib/metadata/toOpenGraph";
import { toPageTitle } from "@/shared/lib/metadata/toPageTitle";

interface PageMetadataOptions {
	canonical?: boolean;
}

/**
 * 메타데이터 > 페이지 메타데이터 변환
 *
 * - 화면 제목을 제목과 오픈 그래프 제목에 사용
 * - path가 있으면 og:url에 사용, 상대 경로는 루트의 metadataBase로 절대 주소가 됨
 * - path가 있고 canonical이 true(기본값)이면 같은 path를 대표 주소(canonical)로도 지정
 * - path가 없으면 og:url과 대표 주소를 지정하지 않음
 * - 페이지가 openGraph와 twitter를 지정하면 루트 값이 통째로 대체되므로 루트의 이미지를 다시 채움
 */
export async function toPageMetadata(
	title: string,
	parent: ResolvingMetadata,
	path?: string,
	{ canonical = true }: PageMetadataOptions = {},
): Promise<Metadata> {
	const { openGraph, twitter } = await parent;
	const metadata: Metadata = {
		title,
		openGraph: {
			...toOpenGraph(toPageTitle(title)),
			url: path,
			images: openGraph?.images,
		},
		twitter: {
			card: siteMetadata.twitterCard,
			images: twitter?.images,
		},
	};

	if (path !== undefined && canonical) {
		metadata.alternates = { canonical: path };
	}

	return metadata;
}

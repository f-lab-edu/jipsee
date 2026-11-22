import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/entities/session/api/getSession";
import { toKeyword } from "@/pages/search/lib/toKeyword";
import { toSearchTitle } from "@/pages/search/lib/toSearchTitle";
import SearchPage from "@/pages/search/ui/SearchPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 검색 > 메타데이터
 *
 * - keyword 쿼리를 검색어로 변환해 제목 생성
 * - og:url은 검색어를 넣은 경로이고 검색 결과는 색인하지 않으므로 대표 주소는 지정하지 않음
 * - 검색 결과는 색인하지 않고(noindex) 링크는 따라감(follow)
 */
export async function generateMetadata(
	{ searchParams }: PageProps<"/search">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { keyword } = await searchParams;

	const searchKeyword = toKeyword(keyword);

	const metadata = await toPageMetadata(
		toSearchTitle(searchKeyword),
		parent,
		paths.searchWithKeyword(searchKeyword),
		{ canonical: false },
	);

	return { ...metadata, robots: { index: false, follow: true } };
}

/**
 * 검색 > 페이지
 *
 * - keyword 쿼리를 검색어로 변환
 * - 검색어가 비면 홈으로 이동
 * - 검색어가 있으면 세션 조회 후 검색 화면에 전달
 */
export default async function Page({ searchParams }: PageProps<"/search">) {
	const { keyword } = await searchParams;
	const searchKeyword = toKeyword(keyword);

	if (searchKeyword === "") {
		redirect(paths.home);
	}

	const session = await getSession();

	return <SearchPage keyword={searchKeyword} session={session} />;
}

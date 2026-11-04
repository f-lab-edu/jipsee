import { redirect } from "next/navigation";
import { getSession } from "@/entities/session/api/getSession";
import { toKeyword } from "@/pages/search/lib/toKeyword";
import SearchPage from "@/pages/search/ui/SearchPage";
import { paths } from "@/shared/routes/paths";

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

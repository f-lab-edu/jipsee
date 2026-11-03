import { getSession } from "@/entities/session/api/getSession";
import { toKeyword } from "@/pages/home/lib/toKeyword";
import HomePage from "@/pages/home/ui/HomePage";

/**
 * 홈 > 페이지
 *
 * - keyword 쿼리를 검색어로 변환
 * - 세션 조회 후 홈 화면에 전달
 */
export default async function Page({ searchParams }: PageProps<"/">) {
	const { keyword } = await searchParams;
	const session = await getSession();

	return <HomePage keyword={toKeyword(keyword)} session={session} />;
}

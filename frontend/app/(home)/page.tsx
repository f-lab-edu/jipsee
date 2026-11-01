import { getSession } from "@/entities/session/api/getSession";
import { toKeyword } from "@/pages/home/lib/toKeyword";
import HomePage from "@/pages/home/ui/HomePage";

/** keyword 쿼리를 검색어로 바꾸고 세션을 조회해 홈 화면에 전달함 */
export default async function Page({ searchParams }: PageProps<"/">) {
	const { keyword } = await searchParams;
	const session = await getSession();

	return <HomePage keyword={toKeyword(keyword)} session={session} />;
}

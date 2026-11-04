import { getSession } from "@/entities/session/api/getSession";
import HomePage from "@/pages/home/ui/HomePage";

/**
 * 홈 > 페이지
 *
 * - 세션 조회 후 홈 화면에 전달
 */
export default async function Page() {
	const session = await getSession();

	return <HomePage session={session} />;
}

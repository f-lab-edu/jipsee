import type { Metadata, ResolvingMetadata } from "next";
import { getSession } from "@/entities/session/api/getSession";
import HomePage from "@/pages/home/ui/HomePage";
import { toHomeMetadata } from "@/shared/lib/metadata/toHomeMetadata";

/**
 * 홈 > 메타데이터
 *
 * - 대표 주소와 og:url을 홈 경로로 지정
 * - 루트 레이아웃에는 지정하지 않아 다른 페이지가 홈 주소를 물려받지 않음
 */
export async function generateMetadata(
	_props: PageProps<"/">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toHomeMetadata(parent);
}

/**
 * 홈 > 페이지
 *
 * - 세션 조회 후 홈 화면에 전달
 */
export default async function Page() {
	const session = await getSession();

	return <HomePage session={session} />;
}

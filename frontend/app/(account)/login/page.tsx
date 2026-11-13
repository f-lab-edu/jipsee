import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/entities/session/api/getSession";
import { toSafeNext } from "@/pages/login/lib/toSafeNext";
import LoginPage from "@/pages/login/ui/LoginPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 로그인 > 메타데이터
 *
 * - 제목을 로그인으로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/login">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata("로그인", parent);
}

/**
 * 로그인 > 페이지
 *
 * - 로그인한 상태면 홈으로 이동
 * - next 쿼리를 같은 사이트 경로만 남겨 변환
 * - error 쿼리는 값과 상관없이 키가 있는지만 전달
 */
export default async function Page({ searchParams }: PageProps<"/login">) {
	const session = await getSession();

	if (session) {
		redirect(paths.home);
	}

	const { next, error } = await searchParams;

	return <LoginPage next={toSafeNext(next)} hasError={error !== undefined} />;
}

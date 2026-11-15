import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/entities/session/api/getSession";
import MePage from "@/pages/me/ui/MePage";
import { pageTitleCopy } from "@/shared/config/pageTitleCopy";
import { toFormError } from "@/shared/lib/formError/toFormError";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 내 정보 > 메타데이터
 *
 * - 제목을 내 정보로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/me">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata(pageTitleCopy.me, parent);
}

/**
 * 내 정보 > 페이지
 *
 * - 로그인하지 않은 상태면 돌아올 경로를 담아 로그인으로 이동
 * - error 쿼리가 로그아웃이나 탈퇴 실패 코드이면 실패 안내용으로 전달
 */
export default async function Page({ searchParams }: PageProps<"/me">) {
	const session = await getSession();

	if (!session) {
		redirect(paths.loginWithNext(paths.me));
	}

	const { error } = await searchParams;

	return (
		<MePage
			session={session}
			formError={toFormError(error, ["logout-failed", "withdraw-failed"])}
		/>
	);
}

import type { Metadata, ResolvingMetadata } from "next";
import { getSession } from "@/entities/session/api/getSession";
import { termsDocument } from "@/pages/policy/config/termsDocument";
import PolicyDocumentPage from "@/pages/policy/ui/PolicyDocumentPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 이용약관 > 메타데이터
 *
 * - 제목을 이용약관으로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/policies/terms">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata(termsDocument.title, parent);
}

/**
 * 이용약관 > 페이지
 *
 * - 로그인 여부와 상관없이 열림
 */
export default async function Page() {
	const session = await getSession();

	return (
		<PolicyDocumentPage
			session={session}
			currentPath={paths.terms}
			policyDocument={termsDocument}
		/>
	);
}

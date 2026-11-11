import type { Metadata, ResolvingMetadata } from "next";
import { getSession } from "@/entities/session/api/getSession";
import { privacyDocument } from "@/pages/policy/config/privacyDocument";
import PolicyDocumentPage from "@/pages/policy/ui/PolicyDocumentPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";
import { paths } from "@/shared/routes/paths";

/**
 * 개인정보처리방침 > 메타데이터
 *
 * - 제목을 개인정보처리방침으로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/policies/privacy">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata(privacyDocument.title, parent);
}

/**
 * 개인정보처리방침 > 페이지
 *
 * - 로그인 여부와 상관없이 열림
 */
export default async function Page() {
	const session = await getSession();

	return (
		<PolicyDocumentPage
			session={session}
			currentPath={paths.privacy}
			policyDocument={privacyDocument}
		/>
	);
}

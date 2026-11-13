import type { Metadata, ResolvingMetadata } from "next";
import { getDataSourceCards } from "@/entities/dataSource/api/getDataSourceCards";
import { getSession } from "@/entities/session/api/getSession";
import { dataSourcesCopy } from "@/pages/policy/config/dataSourcesCopy";
import DataSourcesPage from "@/pages/policy/ui/DataSourcesPage";
import { toPageMetadata } from "@/shared/lib/metadata/toPageMetadata";

/**
 * 데이터 출처 > 메타데이터
 *
 * - 제목을 데이터 출처로 생성
 */
export async function generateMetadata(
	_props: PageProps<"/policies/data-sources">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	return toPageMetadata(dataSourcesCopy.title, parent);
}

/**
 * 데이터 출처 > 페이지
 *
 * - 로그인 여부와 상관없이 열림
 */
export default async function Page() {
	const [session, items] = await Promise.all([
		getSession(),
		getDataSourceCards(),
	]);

	return <DataSourcesPage session={session} items={items} />;
}

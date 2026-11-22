import { pageTitleCopy } from "@/shared/config/pageTitleCopy";
import { siteMetadata } from "@/shared/config/siteMetadata";
import { paths } from "@/shared/routes/paths";

const sectionTitle = "페이지";

/**
 * 메타데이터 > llms.txt 본문 변환
 *
 * - 사이트 이름, 설명, 색인 대상 페이지(홈, 데이터 출처)를 llmstxt.org 형식으로 출력
 * - 페이지 주소는 절대 주소(siteUrl 기준)
 */
export function toLlmsText(siteUrl: string): string {
	const pages = [
		{ title: siteMetadata.name, path: paths.home },
		{ title: pageTitleCopy.dataSources, path: paths.dataSources },
	];
	const links = pages.map(
		({ title, path }) => `- [${title}](${new URL(path, siteUrl).toString()})`,
	);

	return [
		`# ${siteMetadata.name}`,
		"",
		`> ${siteMetadata.description}`,
		"",
		`## ${sectionTitle}`,
		"",
		...links,
		"",
	].join("\n");
}

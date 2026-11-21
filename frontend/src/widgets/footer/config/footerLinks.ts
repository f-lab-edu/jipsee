import { pageTitleCopy } from "@/shared/config/pageTitleCopy";
import { phase2RoutesEnabled } from "@/shared/config/phase2Routes";
import { paths } from "@/shared/routes/paths";

const allFooterLinks = [
	{ href: paths.dataSources, label: pageTitleCopy.dataSources },
	{ href: paths.terms, label: "이용약관" },
	{ href: paths.privacy, label: "개인정보처리방침" },
];

// phase2RoutesEnabled가 false이면 이용약관과 개인정보처리방침 링크를 숨김
export const footerLinks = phase2RoutesEnabled
	? allFooterLinks
	: allFooterLinks.filter((link) => link.href === paths.dataSources);

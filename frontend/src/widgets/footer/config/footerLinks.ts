import { pageTitleCopy } from "@/shared/config/pageTitleCopy";
import { paths } from "@/shared/routes/paths";

export const footerLinks = [
	{ href: paths.dataSources, label: pageTitleCopy.dataSources },
	{ href: paths.terms, label: "이용약관" },
	{ href: paths.privacy, label: "개인정보처리방침" },
];

import { paths } from "@/shared/routes/paths";

export const policyLinks = [
	{ label: "이용약관", href: paths.terms },
	{ label: "개인정보처리방침", href: paths.privacy },
	{ label: "데이터 출처", href: paths.dataSources },
] as const;

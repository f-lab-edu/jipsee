import "@seed-design/css/all.css";
import "./theme.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Jipsee",
};

/** 모든 페이지에 공통으로 적용되는 루트 HTML 구조를 표시함 */
export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="ko" data-seed data-seed-color-mode="light-only">
			<head>
				<meta name="color-scheme" content="light" />
			</head>
			<body>{children}</body>
		</html>
	);
}

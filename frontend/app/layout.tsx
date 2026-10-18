import "@seed-design/css/all.css";
import "./theme.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Jipsee",
};

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

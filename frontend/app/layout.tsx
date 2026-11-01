import "@seed-design/css/all.css";
import "./theme.css";
import { generateThemingScript } from "@seed-design/css/theming";
import type { Metadata } from "next";
import { siteMetadata } from "@/shared/config/siteMetadata";
import ColorSchemeSync from "@/shared/ui/ColorSchemeSync";

export const metadata: Metadata = {
	title: siteMetadata.name,
};

/** 모든 페이지에 공통으로 적용되는 루트 HTML 구조를 표시함 */
export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="ko"
			data-seed
			data-seed-color-mode="system"
			suppressHydrationWarning
		>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Seed가 만든 고정 테마 스크립트
					dangerouslySetInnerHTML={{
						__html: generateThemingScript({ mode: "system" }),
					}}
				/>
			</head>
			<body>
				<ColorSchemeSync />
				{children}
			</body>
		</html>
	);
}

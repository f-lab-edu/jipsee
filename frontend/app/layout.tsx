import "@seed-design/css/all.css";
import "./theme.css";
import { generateThemingScript } from "@seed-design/css/theming";
import type { Metadata, Viewport } from "next";
import { getSession } from "@/entities/session/api/getSession";
import SessionProvider from "@/entities/session/ui/SessionProvider";
import { siteMetadata } from "@/shared/config/siteMetadata";
import { getSiteUrl } from "@/shared/config/siteUrl";
import { toOpenGraph } from "@/shared/lib/metadata/toOpenGraph";
import ColorSchemeSync from "@/shared/ui/ColorSchemeSync";

export const metadata: Metadata = {
	metadataBase: new URL(getSiteUrl()),
	title: {
		default: siteMetadata.name,
		template: siteMetadata.titleTemplate,
	},
	description: siteMetadata.description,
	openGraph: toOpenGraph(siteMetadata.name),
	twitter: { card: siteMetadata.twitterCard },
};

// env(safe-area-inset-bottom)가 값을 가지려면 viewport-fit=cover 필요
export const viewport: Viewport = { viewportFit: "cover" };

/**
 * 루트 레이아웃
 *
 * - 모든 페이지에 공통으로 적용되는 HTML 구조 출력
 * - error.tsx가 세션을 읽을 수 있도록 세션 공급자로 내용을 감쌈
 */
export default async function RootLayout({ children }: LayoutProps<"/">) {
	const session = await getSession();

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
				<SessionProvider session={session}>{children}</SessionProvider>
			</body>
		</html>
	);
}

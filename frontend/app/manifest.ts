import type { MetadataRoute } from "next";
import { siteMetadata } from "@/shared/config/siteMetadata";

/** 웹 앱 매니페스트 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: siteMetadata.name,
		short_name: siteMetadata.name,
		description: siteMetadata.description,
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: siteMetadata.themeColor,
		lang: "ko",
		icons: [
			{
				src: "/icons/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icons/icon-maskable-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}

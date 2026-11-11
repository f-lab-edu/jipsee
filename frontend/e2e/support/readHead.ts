import type { Page } from "@playwright/test";

/** 문서 head의 제목, 메타 태그, 아이콘 링크 */
export async function readHead(page: Page) {
	return page.evaluate(() => {
		const readMeta = (key: string) =>
			document
				.querySelector(`meta[property="${key}"], meta[name="${key}"]`)
				?.getAttribute("content") ?? null;
		const readLink = (rel: string) => {
			const element = document.querySelector(`link[rel="${rel}"]`);
			if (!element) return null;
			return {
				href: element.getAttribute("href"),
				type: element.getAttribute("type"),
				sizes: element.getAttribute("sizes"),
			};
		};
		return {
			title: document.title,
			description: readMeta("description"),
			ogTitle: readMeta("og:title"),
			ogDescription: readMeta("og:description"),
			ogSiteName: readMeta("og:site_name"),
			ogLocale: readMeta("og:locale"),
			ogType: readMeta("og:type"),
			ogImage: readMeta("og:image"),
			ogImageWidth: readMeta("og:image:width"),
			ogImageHeight: readMeta("og:image:height"),
			ogImageAlt: readMeta("og:image:alt"),
			twitterCard: readMeta("twitter:card"),
			twitterImage: readMeta("twitter:image"),
			icon: readLink("icon"),
			appleIcon: readLink("apple-touch-icon"),
		};
	});
}

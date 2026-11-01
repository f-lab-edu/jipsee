"use client";

import { useLayoutEffect } from "react";

/** strict mode > 재마운트로 지워진 data-seed-user-color-scheme 속성을 시스템 설정에 맞춰 다시 넣음 */
export default function ColorSchemeSync() {
	useLayoutEffect(() => {
		const root = document.documentElement;
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

		if (prefersDark.matches) {
			root.dataset.seedUserColorScheme = "dark";
			return;
		}

		root.dataset.seedUserColorScheme = "light";
	}, []);

	return null;
}

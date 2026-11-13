import type { Page } from "@playwright/test";

/** 콘솔 오류, hydration 경고, pageerror를 모아 반환함. 반환한 배열은 비우고 읽을 수 있음 */
export function collectConsoleIssues(page: Page): string[] {
	const issues: string[] = [];
	page.on("console", (message) => {
		const text = message.text();
		const isResource404 =
			/Failed to load resource/.test(text) &&
			message.location().url === page.url();
		if (isResource404) return;
		// 개발 서버에서만 나오는 알려진 메시지임. notFound() 경로의 Seed 테마 스크립트 때문이고 운영 빌드에는 없음
		if (
			message.type() === "error" &&
			text.includes("Encountered a script tag while rendering React component")
		) {
			return;
		}
		// 오류 TC가 일부러 4xx와 5xx로 가로챈 질문 전송 요청임. 화면의 오류 상자가 이 실패를 보여 줌
		if (
			message.type() === "error" &&
			/Failed to load resource/.test(text) &&
			message.location().url.endsWith("/api/chats/messages")
		) {
			return;
		}
		if (
			message.type() === "error" ||
			(message.type() === "warning" && /hydrat/i.test(text))
		) {
			issues.push(`${message.type()}: ${text.slice(0, 200)}`);
		}
	});
	page.on("pageerror", (error) => {
		issues.push(`pageerror: ${String(error.message).slice(0, 200)}`);
	});
	return issues;
}

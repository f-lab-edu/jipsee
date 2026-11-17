import { createServer, type Server } from "node:http";
import type { BrowserContext } from "@playwright/test";

/**
 * 로그아웃과 탈퇴 BFF 경로(`relayToBackend`)가 부르는 백엔드를 대신하는 가짜 서버
 *
 * - 앱은 서버에서 API_URL을 부르므로 `page.route`로 가로챌 수 없음. 그래서 실제 서버를 하나 띄움
 * - 응답은 브라우저 쿠키 `jipsee-stub-backend`의 값으로 정함. 앱이 요청의 Cookie를 그대로 실어 보내므로 TC마다 다른 응답을 받을 수 있음
 * - 쿠키가 없으면 서버 오류(500)임. 백엔드가 없을 때와 같은 실패로 처리됨
 * - 포트는 API_URL(기본 http://localhost:8080)을 따름. 개발 서버의 `.env.local`과 같은 값이어야 함
 */
export const STUB_COOKIE = "jipsee-stub-backend";
export type StubMode = "ok" | "unauthorized" | "serverError";

const DELETED_SESSION = "JSESSIONID=; Max-Age=0; Path=/";

export function readStubPort() {
	const apiUrl = process.env.API_URL ?? "http://localhost:8080";
	return Number(new URL(apiUrl).port || 80);
}

function readMode(cookieHeader: string | undefined): StubMode | null {
	const match = cookieHeader?.match(
		new RegExp(`(?:^|;\\s*)${STUB_COOKIE}=([^;]+)`),
	);
	const value = match?.[1];
	return value === "ok" || value === "unauthorized" || value === "serverError"
		? value
		: null;
}

/** 포트가 이미 쓰이고 있으면 null을 반환함 */
export async function startStubBackend(): Promise<Server | null> {
	const server = createServer((request, response) => {
		const mode = readMode(request.headers.cookie);
		const isLogout = request.method === "POST" && request.url === "/logout";
		const isWithdraw =
			request.method === "DELETE" && request.url === "/api/users/me";
		if (!isLogout && !isWithdraw) {
			response.writeHead(404).end();
			return;
		}
		if (mode === "ok") {
			// 로그아웃은 리다이렉트로, 탈퇴는 204로 세션 쿠키를 지움
			if (isLogout) {
				response.writeHead(302, {
					location: "/",
					"set-cookie": DELETED_SESSION,
				});
			} else {
				response.writeHead(204, { "set-cookie": DELETED_SESSION });
			}
			response.end();
			return;
		}
		response.writeHead(mode === "unauthorized" ? 401 : 500).end();
	});

	return new Promise((resolve) => {
		server.once("error", () => resolve(null));
		server.listen(readStubPort(), () => resolve(server));
	});
}

export const STUB_DELETED_SESSION = DELETED_SESSION;

/** 가짜 백엔드가 떠 있는지. globalSetup이 정한 값을 TC가 실행될 때 읽어야 하므로 함수로 둠 */
export function STUB_ON() {
	return process.env.TC_STUB_BACKEND === "on";
}

export const STUB_SKIP_REASON =
	"가짜 백엔드를 띄우지 못했음(API_URL 포트 사용 중)";

/** 이 브라우저 컨텍스트의 요청에 가짜 백엔드가 줄 응답을 정함 */
export async function setStubMode(context: BrowserContext, mode: StubMode) {
	await context.addCookies([
		{ name: STUB_COOKIE, value: mode, domain: "localhost", path: "/" },
	]);
}

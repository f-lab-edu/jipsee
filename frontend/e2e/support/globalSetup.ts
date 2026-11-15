import { startStubBackend } from "./stubBackend";

/**
 * 가짜 백엔드를 한 번 띄우고 결과를 TC_STUB_BACKEND(on, off)로 알림
 *
 * - API_URL의 포트를 이미 다른 서버(실제 백엔드)가 쓰고 있으면 띄우지 않고 가짜 백엔드가 필요한 TC를 건너뜀(건너뜀 사유가 TC 결과에 나옴)
 */
export default async function globalSetup() {
	const server = await startStubBackend();
	process.env.TC_STUB_BACKEND = server ? "on" : "off";
	if (!server) {
		return undefined;
	}
	return () =>
		new Promise<void>((resolve) => {
			server.close(() => resolve());
		});
}

import { getApiUrl } from "@/shared/api/apiUrl";

export const dynamic = "force-dynamic";

/** 백엔드 헬스 체크 응답을 그대로 전달하고, 호출에 실패하면 오류 상태를 반환함 */
export async function GET() {
	let apiUrl: string;
	try {
		apiUrl = getApiUrl();
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "API_URL 확인 실패";
		return new Response(message, { status: 500 });
	}

	try {
		const upstream = await fetch(`${apiUrl}/actuator/health`, {
			cache: "no-store",
			signal: AbortSignal.timeout(3000),
		});
		return new Response(upstream.body, {
			status: upstream.status,
			headers: {
				"content-type":
					upstream.headers.get("content-type") ?? "application/json",
			},
		});
	} catch {
		return new Response("API 호출 실패", { status: 502 });
	}
}

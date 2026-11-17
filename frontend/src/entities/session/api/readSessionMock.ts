import type { Session } from "@/entities/session/model/session";
import { readMockSetting } from "@/shared/lib/mock/readMockSetting";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 세션 > 목업 세션 조회
 *
 * - 쿠키 jipsee-mock-session 또는 환경 변수 MOCK_SESSION의 값으로 결정
 * - KAKAO, GOOGLE, NAVER이면 그 제공자로 로그인한 세션 반환
 * - none이거나 값이 없으면 로그인하지 않은 상태로 null 반환
 * - 운영 빌드에서는 항상 null 반환
 */
export async function readSessionMock(): Promise<Nullable<Session>> {
	const provider = await readMockSetting({
		cookieName: "jipsee-mock-session",
		envValue: process.env.MOCK_SESSION,
		values: ["KAKAO", "GOOGLE", "NAVER", "none"],
	});

	if (provider === undefined || provider === "none") {
		return null;
	}

	return { provider };
}

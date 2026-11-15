// 앱의 목업 쿠키를 TC_SESSION, TC_PROVIDER, TC_CHAT에서 만들어 모든 TC의 브라우저에 미리 넣음
// 앱의 소스와 .env.local의 MOCK_SESSION, MOCK_CHAT은 고치지 않아도 됨. 쿠키가 환경 변수보다 앞섬
// TC_SESSION=in이면 TC_PROVIDER(google, kakao, naver. 기본 kakao)로 로그인하고 없으면 none으로 로그아웃함
// TC_CHAT은 normal, dailyLimit, serverError, rateLimit, noHistory 중 하나이고 기본은 normal임
// TC_BUILDING_FAILURE는 none, searchFailed, searchRateLimited, buildingFailed, buildingRateLimited 중 하나이고 기본은 none임
const provider = (process.env.TC_PROVIDER ?? "kakao").toUpperCase();
const session = process.env.TC_SESSION === "in" ? provider : "none";
const chat = process.env.TC_CHAT ?? "normal";
const buildingFailure = process.env.TC_BUILDING_FAILURE ?? "none";

function createCookie(name: string, value: string) {
	return {
		name,
		value,
		domain: "localhost",
		path: "/",
		expires: -1,
		httpOnly: false,
		secure: false,
		sameSite: "Lax" as const,
	};
}

export const mockStorageState = {
	cookies: [
		createCookie("jipsee-mock-session", session),
		createCookie("jipsee-mock-chat", chat),
		createCookie("jipsee-mock-building", buildingFailure),
	],
	origins: [],
};

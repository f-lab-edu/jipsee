import type { Provider } from "@/entities/session/model/session";

export const providerNames: Record<Provider, string> = {
	GOOGLE: "구글 계정",
	KAKAO: "카카오 계정",
	NAVER: "네이버 계정",
};

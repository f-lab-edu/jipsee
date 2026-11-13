import type { Provider } from "@/entities/session/model/session";

export const loginProviders: Record<
	Provider,
	{ label: string; pathSegment: string }
> = {
	GOOGLE: { label: "구글로 계속하기", pathSegment: "google" },
	KAKAO: { label: "카카오로 계속하기", pathSegment: "kakao" },
	NAVER: { label: "네이버로 계속하기", pathSegment: "naver" },
};

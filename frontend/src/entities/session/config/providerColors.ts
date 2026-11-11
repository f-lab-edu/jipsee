import type { ProviderColor } from "@/entities/session/model/providerColor";
import type { Provider } from "@/entities/session/model/session";

// 값은 app/theme.css의 제공자 색 변수에 있음
export const providerColors: Record<Provider, ProviderColor> = {
	GOOGLE: {
		background: "var(--jipsee-color-google-background)",
		border: "var(--jipsee-color-google-border)",
		text: "var(--jipsee-color-google-text)",
	},
	KAKAO: {
		background: "var(--jipsee-color-kakao-background)",
		text: "var(--jipsee-color-kakao-text)",
	},
	NAVER: {
		background: "var(--jipsee-color-naver-background)",
		text: "var(--jipsee-color-naver-text)",
	},
};

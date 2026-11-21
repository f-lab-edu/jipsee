import { phase2RoutesEnabled } from "../../src/shared/config/phase2Routes";

// phase2RoutesEnabled가 false이면 /login, /chat, /me가 404라 이 경로를 여는 TC를 건너뜀
export const PHASE2_OFF = !phase2RoutesEnabled;
export const PHASE2_SKIP_REASON =
	"1단계에서는 /login, /chat, /me가 404임(src/shared/config/phase2Routes.ts)";

// phase2RoutesEnabled가 false이면 이용약관과 개인정보처리방침이 404이고 푸터 링크도 없음
export const PHASE2_HIDDEN_POLICY_PATHS: readonly string[] = [
	"/policies/terms",
	"/policies/privacy",
];
export const PHASE1_POLICY_SKIP_REASON =
	"1단계에서는 /policies/terms, /policies/privacy가 404이고 푸터 링크가 없음(src/shared/config/phase2Routes.ts)";

export function isHiddenPolicyPath(path: string) {
	return PHASE2_OFF && PHASE2_HIDDEN_POLICY_PATHS.includes(path);
}

// phase2RoutesEnabled가 false이면 하단 내비게이션이 없고 푸터가 열의 맨 아래에 놓임
export const PHASE1_BOTTOM_NAV_SKIP_REASON =
	"1단계에서는 하단 내비게이션이 없음(src/shared/config/phase2Routes.ts)";

import { phase2RoutesEnabled } from "../../src/shared/config/phase2Routes";

// phase2RoutesEnabled가 false이면 /login, /chat, /me가 404라 이 경로를 여는 TC를 건너뜀
export const PHASE2_OFF = !phase2RoutesEnabled;
export const PHASE2_SKIP_REASON =
	"1단계에서는 /login, /chat, /me가 404임(src/shared/config/phase2Routes.ts)";

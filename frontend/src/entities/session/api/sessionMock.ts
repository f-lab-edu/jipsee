import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

// null이면 로그인하지 않은 상태
export const sessionMock: Nullable<Session> = null;

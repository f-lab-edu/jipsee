import { useContext } from "react";
import type { Session } from "@/entities/session/model/session";
import { SessionContext } from "@/entities/session/model/sessionContext";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/** 세션 > 현재 세션 읽기. 루트 레이아웃이 채운 값 반환 */
export function useSession(): Nullable<Session> {
	return useContext(SessionContext);
}

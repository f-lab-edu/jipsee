import { sessionMock } from "@/entities/session/api/sessionMock";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/** 현재 세션을 반환함. 백엔드가 없어 목업을 반환함 */
export async function getSession(): Promise<Nullable<Session>> {
	return sessionMock;
}

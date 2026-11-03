import { sessionMock } from "@/entities/session/api/sessionMock";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 세션 > 현재 세션 조회
 *
 * - 백엔드가 없어 목업 반환
 */
export async function getSession(): Promise<Nullable<Session>> {
	return sessionMock;
}

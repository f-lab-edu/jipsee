import { cache } from "react";
import { sessionMock } from "@/entities/session/api/sessionMock";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 세션 > 현재 세션 조회
 *
 * - 백엔드가 없어 목업 반환
 * - 한 요청 안에서 여러 번 불러도 한 번만 조회하도록 cache로 감쌈
 */
export const getSession = cache(
	async (): Promise<Nullable<Session>> => sessionMock,
);

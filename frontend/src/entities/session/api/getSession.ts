import { cache } from "react";
import { readSessionMock } from "@/entities/session/api/readSessionMock";

/**
 * 세션 > 현재 세션 조회
 *
 * - 백엔드가 없어 목업 세션 반환
 * - 한 요청 안에서 여러 번 불러도 한 번만 조회하도록 cache로 감쌈
 */
export const getSession = cache(readSessionMock);

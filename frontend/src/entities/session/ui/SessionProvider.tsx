"use client";

import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import { SessionContext } from "@/entities/session/model/sessionContext";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface SessionProviderProps {
	session: Nullable<Session>;
	children: ReactNode;
}

/**
 * 세션 > 공급자
 *
 * - 서버에서 조회한 세션을 클라이언트 컴포넌트(error.tsx)에 전달
 */
export default function SessionProvider({
	session,
	children,
}: SessionProviderProps) {
	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
}

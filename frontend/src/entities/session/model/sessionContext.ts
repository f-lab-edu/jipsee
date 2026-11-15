import { createContext } from "react";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

// 서버 컴포넌트가 아닌 error.tsx가 세션을 읽을 수 있도록 루트 레이아웃이 채움
export const SessionContext = createContext<Nullable<Session>>(null);

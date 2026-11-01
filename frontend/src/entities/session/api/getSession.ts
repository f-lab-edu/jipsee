import { sessionMock } from "@/entities/session/api/sessionMock";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export async function getSession(): Promise<Nullable<Session>> {
	return sessionMock;
}

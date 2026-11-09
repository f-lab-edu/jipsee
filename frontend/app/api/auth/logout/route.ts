import { backendPaths } from "@/entities/session/api/backendPaths";
import { relayToBackend } from "@/entities/session/api/relayToBackend";

export const dynamic = "force-dynamic";

/** API > 로그아웃 */
export async function POST(request: Request) {
	return relayToBackend(request, backendPaths.logout);
}

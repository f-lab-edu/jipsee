import { backendPaths } from "@/entities/session/api/backendPaths";
import { relayToBackend } from "@/entities/session/api/relayToBackend";

export const dynamic = "force-dynamic";

/** API > 회원 탈퇴 */
export async function POST(request: Request) {
	return relayToBackend(request, backendPaths.withdraw);
}

import { backendPaths } from "@/entities/session/api/backendPaths";
import { relayToBackend } from "@/entities/session/api/relayToBackend";
import { phase2RoutesEnabled } from "@/shared/config/phase2Routes";

export const dynamic = "force-dynamic";

/**
 * API > 회원 탈퇴
 *
 * - phase2RoutesEnabled가 false이면 404 반환
 */
export async function POST(request: Request) {
	if (!phase2RoutesEnabled) {
		return new Response(null, { status: 404 });
	}

	return relayToBackend(request, backendPaths.withdraw);
}

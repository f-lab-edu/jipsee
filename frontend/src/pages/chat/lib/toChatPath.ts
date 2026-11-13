import { paths } from "@/shared/routes/paths";

/**
 * 채팅 > 현재 경로 변환
 *
 * - buildingId 쿼리가 문자열이면 그대로 담은 경로 반환
 * - 없으면 채팅 경로 반환
 */
export function toChatPath(buildingId: string | string[] | undefined): string {
	if (typeof buildingId !== "string") {
		return paths.chat;
	}

	return `${paths.chat}?${new URLSearchParams({ buildingId }).toString()}`;
}

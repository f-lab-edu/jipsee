import { padTwoDigits } from "@/entities/chat/lib/padTwoDigits";
import { toKstParts } from "@/entities/chat/lib/toKstParts";

/**
 * 채팅 > 한국 시간 ISO 8601 문자열 변환
 *
 * - 2026-11-13T14:20:00+09:00 형식 반환
 */
export function toKstIso(date: Date): string {
	const parts = toKstParts(date);

	return `${parts.year}-${padTwoDigits(parts.month)}-${padTwoDigits(parts.day)}T${padTwoDigits(parts.hour)}:${padTwoDigits(parts.minute)}:00+09:00`;
}

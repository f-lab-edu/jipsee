import { padTwoDigits } from "@/entities/chat/lib/padTwoDigits";
import { parseKstIso } from "@/entities/chat/lib/parseKstIso";
import { toKstParts } from "@/entities/chat/lib/toKstParts";

const dayMs = 24 * 60 * 60 * 1000;

/**
 * 채팅 > 목록 시각 표시 변환
 *
 * - 오늘이면 오늘 HH:mm 반환
 * - 어제이면 어제 반환
 * - 같은 해이면 M.D 반환
 * - 다른 해이면 yyyy.M.D 반환
 * - 날짜는 한국 시간 기준으로 비교
 * - 오프셋이 없는 iso는 한국 시간으로 해석
 */
export function toChatTimeLabel(iso: string, now: Date): string {
	const target = toKstParts(parseKstIso(iso));
	const today = toKstParts(now);
	const yesterday = toKstParts(new Date(now.getTime() - dayMs));

	if (
		target.year === today.year &&
		target.month === today.month &&
		target.day === today.day
	) {
		return `오늘 ${padTwoDigits(target.hour)}:${padTwoDigits(target.minute)}`;
	}

	if (
		target.year === yesterday.year &&
		target.month === yesterday.month &&
		target.day === yesterday.day
	) {
		return "어제";
	}

	if (target.year === today.year) {
		return `${target.month}.${target.day}`;
	}

	return `${target.year}.${target.month}.${target.day}`;
}

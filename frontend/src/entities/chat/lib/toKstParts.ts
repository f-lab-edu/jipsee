import type { KstParts } from "@/entities/chat/model/kstParts";

const kstOffsetMs = 9 * 60 * 60 * 1000;

/**
 * 채팅 > 한국 시간 구성 요소 변환
 *
 * - 서버 시간대와 상관없이 UTC에 9시간을 더해 한국 시간 값을 반환
 */
export function toKstParts(date: Date): KstParts {
	const shifted = new Date(date.getTime() + kstOffsetMs);

	return {
		year: shifted.getUTCFullYear(),
		month: shifted.getUTCMonth() + 1,
		day: shifted.getUTCDate(),
		hour: shifted.getUTCHours(),
		minute: shifted.getUTCMinutes(),
	};
}

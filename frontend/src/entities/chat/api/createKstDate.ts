/**
 * 채팅 > 한국 시간 날짜 생성
 *
 * - 한국 시간 기준 연, 월, 일, 시, 분으로 날짜 생성
 */
export function createKstDate(
	year: number,
	month: number,
	day: number,
	hour: number,
	minute: number,
): Date {
	return new Date(Date.UTC(year, month - 1, day, hour - 9, minute));
}

/** 채팅 > 두 자리 숫자 문자열 변환 */
export function padTwoDigits(value: number): string {
	return String(value).padStart(2, "0");
}

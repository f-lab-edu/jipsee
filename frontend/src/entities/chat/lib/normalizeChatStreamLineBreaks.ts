/**
 * 채팅 > 스트림 줄바꿈 통일
 *
 * - CRLF와 CR을 LF로 바꿔 반환
 * - 끝에 있는 CR은 다음 조각이 LF로 시작할 수 있어 마지막 조각이 아니면 그대로 둠
 *
 * @param isLast 마지막 조각이면 끝의 CR도 바꿈
 */
export function normalizeChatStreamLineBreaks(
	text: string,
	isLast: boolean,
): string {
	const crlfNormalized = text.replace(/\r\n/g, "\n");

	if (isLast) {
		return crlfNormalized.replace(/\r/g, "\n");
	}

	return crlfNormalized.replace(/\r(?!$)/g, "\n");
}

const titleLength = 40;

/**
 * 채팅 > 대화 제목 변환
 *
 * - 첫 질문의 앞 40자 반환
 */
export function toChatTitle(content: string): string {
	return content.trim().slice(0, titleLength);
}

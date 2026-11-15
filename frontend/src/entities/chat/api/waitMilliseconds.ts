/** 채팅 > 지연 */
export function waitMilliseconds(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

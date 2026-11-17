const idleTimeoutMs = 30_000;

export const idleTimeout = Symbol("idleTimeout");

/**
 * 채팅 > 바이트 읽기와 무응답 제한
 *
 * - 30초 안에 바이트가 오면 읽은 결과 반환
 * - 30초 동안 바이트가 없으면 idleTimeout 반환
 */
export function readWithIdleTimeout(
	reader: ReadableStreamDefaultReader<Uint8Array>,
): Promise<ReadableStreamReadResult<Uint8Array> | typeof idleTimeout> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => resolve(idleTimeout), idleTimeoutMs);

		reader.read().then(
			(result) => {
				clearTimeout(timer);
				resolve(result);
			},
			(error) => {
				clearTimeout(timer);
				reject(error);
			},
		);
	});
}

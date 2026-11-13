/** PNG 헤더에서 가로, 세로 크기를 읽음 */
export function readPngSize(buffer: Buffer) {
	return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/**
 * 목업 > 사용 가능 여부
 *
 * - 운영 빌드(NODE_ENV가 production)이면 사용할 수 없음
 * - 그 밖에는 사용할 수 있음
 */
export function isMockEnabled(): boolean {
	return process.env.NODE_ENV !== "production";
}

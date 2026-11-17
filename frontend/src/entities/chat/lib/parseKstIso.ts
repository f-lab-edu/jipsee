const hasOffset = /(Z|[+-]\d{2}:?\d{2})$/i;
const dateOnly = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 채팅 > 한국 시간 기준 ISO 8601 해석
 *
 * - 오프셋(Z, +09:00 등)이 있으면 그대로 해석
 * - 오프셋이 없으면 한국 시간(+09:00)으로 해석
 * - 날짜만 있으면 한국 시간 0시로 해석
 */
export function parseKstIso(iso: string): Date {
	if (hasOffset.test(iso)) {
		return new Date(iso);
	}

	if (dateOnly.test(iso)) {
		return new Date(`${iso}T00:00:00+09:00`);
	}

	return new Date(`${iso}+09:00`);
}

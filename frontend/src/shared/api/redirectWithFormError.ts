import { toFormErrorPath } from "@/shared/lib/formError/toFormErrorPath";
import type { FormErrorCode } from "@/shared/model/formErrorCode";

/**
 * API > 폼 실패 이동
 *
 * - 일반 텍스트 응답 대신 폼을 보낸 화면으로 error 쿼리를 붙여 303 반환
 */
export function redirectWithFormError(
	path: string,
	code: FormErrorCode,
): Response {
	return new Response(null, {
		status: 303,
		headers: { location: toFormErrorPath(path, code) },
	});
}

import type { FormErrorCode } from "@/shared/model/formErrorCode";

/**
 * 폼 오류 > 돌아갈 경로 변환
 *
 * - 경로 뒤에 error 쿼리로 실패 코드를 붙여 반환
 *
 * @param path 쿼리가 없는 같은 사이트 경로
 */
export function toFormErrorPath(path: string, code: FormErrorCode): string {
	return `${path}?${new URLSearchParams({ error: code })}`;
}

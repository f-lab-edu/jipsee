import { formErrorCodes } from "@/shared/config/formErrorCodes";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { FormErrorCode } from "@/shared/model/formErrorCode";

/**
 * 폼 오류 > error 쿼리 변환
 *
 * - 값이 허용한 코드 중 하나이면 그 코드 반환
 * - 없거나 모르는 값이거나 배열이거나 허용하지 않은 코드이면 null 반환
 *
 * @param accepted 그 화면이 보여 주는 코드. 다른 화면의 코드는 무시
 */
export function toFormError(
	value: string | string[] | undefined,
	accepted: readonly FormErrorCode[],
): Nullable<FormErrorCode> {
	const code = formErrorCodes.find((candidate) => candidate === value);

	if (code === undefined || !accepted.includes(code)) {
		return null;
	}

	return code;
}

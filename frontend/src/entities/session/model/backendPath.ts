import type { FormErrorCode } from "@/shared/model/formErrorCode";

export interface BackendPath {
	method: "POST" | "DELETE";
	path: string;
	// 백엔드가 쿠키를 지우는 리다이렉트로 성공을 알리면 true
	acceptsRedirect: boolean;
	// 호출이 실패했을 때 내 정보 화면에 붙여 보낼 error 쿼리 값
	failureCode: FormErrorCode;
}

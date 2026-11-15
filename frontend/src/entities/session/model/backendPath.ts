export interface BackendPath {
	method: "POST" | "DELETE";
	path: string;
	// 백엔드가 쿠키를 지우는 리다이렉트로 성공을 알리면 true
	acceptsRedirect: boolean;
}

// 백엔드 성공 응답의 공통 껍데기. 본문은 data 필드에 담김
export interface ApiResponse<T> {
	data: T;
}

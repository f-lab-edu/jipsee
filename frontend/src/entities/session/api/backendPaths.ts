import type { BackendPath } from "@/entities/session/model/backendPath";

// 1단계 API 명세가 없어 가정한 값. 명세가 정해지면 이 파일만 바꿈
export const backendPaths: Record<"logout" | "withdraw", BackendPath> = {
	logout: { method: "POST", path: "/logout" },
	withdraw: { method: "DELETE", path: "/api/users/me" },
};

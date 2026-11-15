import type { StatusKind } from "@/shared/model/statusKind";

// 원은 호 두 개로 표현. 시안의 서류에 엑스, 경고 삼각형, 시계 모양과 같은 모양
export const statusIconPaths: Record<StatusKind, readonly string[]> = {
	notFound: ["M7 3h7l4 4v14H7z", "M14 3v4h4", "M10 13l4 4", "M14 13l-4 4"],
	error: ["M12 4l9 16H3z", "M12 10v4", "M12 17v.01"],
	rateLimited: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M12 7v5l3 2"],
};

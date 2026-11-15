import type { StatusKind } from "@/shared/model/statusKind";

// 시안(Err 보드)의 data-area 이름
export const statusAreas: Record<StatusKind, string> = {
	notFound: "status-notfound",
	error: "status-server",
	rateLimited: "status-rate",
};

export const partialStatusAreas = {
	error: "inline-server",
	rateLimited: "inline-rate",
} as const;

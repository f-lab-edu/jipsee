import { commonCopy } from "@/shared/config/commonCopy";
import type { StatusCopy } from "@/shared/model/statusCopy";
import type { StatusKind } from "@/shared/model/statusKind";

export const statusCopy: Record<StatusKind, StatusCopy> = {
	notFound: {
		titleLines: ["페이지를 찾을 수 없어요"],
		description: "주소가 바르지 않거나 삭제된 페이지예요",
	},
	error: { titleLines: [commonCopy.temporaryError] },
	rateLimited: {
		titleLines: ["요청이 많아요.", "잠시 후 다시 시도해 주세요"],
	},
};

export const statusActionCopy = {
	retry: commonCopy.retry,
	home: "홈으로 가기",
} as const;

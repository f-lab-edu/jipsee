import type { FormErrorCode } from "@/shared/model/formErrorCode";

export const formErrorCopy: Record<FormErrorCode, string> = {
	"logout-failed": "로그아웃하지 못했어요. 다시 시도해 주세요",
	"withdraw-failed": "탈퇴하지 못했어요. 다시 시도해 주세요",
	"chat-delete-failed": "대화를 삭제하지 못했어요. 다시 시도해 주세요",
};

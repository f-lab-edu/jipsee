import { Box, Text } from "@seed-design/react";
import { deleteChatCopy } from "@/features/deleteChat/config/deleteChatCopy";
import { deleteChatStyles } from "@/features/deleteChat/config/deleteChatStyles";
import type { DeleteChatVariant } from "@/features/deleteChat/model/deleteChatVariant";
import { paths } from "@/shared/routes/paths";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";

interface DeleteChatButtonProps {
	chatId: number;
	title: string;
	variant: DeleteChatVariant;
}

/**
 * 대화 삭제 > 버튼
 *
 * - 삭제 버튼을 누르면 확인 창을 엶
 * - 접근 가능한 이름은 삭제: 제목
 *
 * @param chatId 삭제할 대화 번호
 * @param title 접근 가능한 이름에 붙일 대화 제목
 * @param variant 목록 화면은 list, 데스크톱 레일은 rail. 버튼 크기를 정함
 */
export default function DeleteChatButton({
	chatId,
	title,
	variant,
}: DeleteChatButtonProps) {
	const style = deleteChatStyles;

	return (
		<ConfirmDialog
			trigger={
				<Box asChild {...style.trigger[variant]}>
					<button
						type="button"
						aria-label={`${deleteChatCopy.label}: ${title}`}
					>
						<Text {...style.triggerText}>{deleteChatCopy.label}</Text>
					</button>
				</Box>
			}
			title={deleteChatCopy.dialogTitle}
			description={deleteChatCopy.description}
			confirmLabel={deleteChatCopy.confirm}
			action={paths.chatDeleteAction(chatId)}
			dataArea="chat-delete-dialog"
		/>
	);
}

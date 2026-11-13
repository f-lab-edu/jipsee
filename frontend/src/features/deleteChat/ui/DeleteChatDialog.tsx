import {
	Box,
	Grid,
	ResponsiveDialogAction,
	ResponsiveDialogBackdrop,
	ResponsiveDialogBody,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHandle,
	ResponsiveDialogPositioner,
	ResponsiveDialogTitle,
	Text,
	VStack,
} from "@seed-design/react";
import { useState } from "react";
import { deleteChatCopy } from "@/features/deleteChat/config/deleteChatCopy";
import { deleteChatStyles } from "@/features/deleteChat/config/deleteChatStyles";
import { paths } from "@/shared/routes/paths";

interface DeleteChatDialogProps {
	chatId: number;
}

/**
 * 대화 삭제 > 확인 창
 *
 * - 제목, 설명, 취소와 삭제하기 버튼 출력
 * - 취소는 창을 닫음
 * - 삭제하기는 삭제 경로로 POST하는 폼의 제출 버튼이며 닫기 동작으로 감싸지 않음
 * - 폼을 제출하면 삭제하기 버튼을 비활성화해 중복 요청을 막음
 *
 * @param chatId 삭제할 대화 번호
 */
export default function DeleteChatDialog({ chatId }: DeleteChatDialogProps) {
	const style = deleteChatStyles;
	const [isSubmitted, setIsSubmitted] = useState(false);

	return (
		<>
			<ResponsiveDialogBackdrop />
			<ResponsiveDialogPositioner>
				<ResponsiveDialogContent
					className={style.contentClassName}
					data-area="chat-delete-dialog"
				>
					<ResponsiveDialogHandle />
					<ResponsiveDialogBody>
						<VStack {...style.body}>
							<ResponsiveDialogTitle asChild>
								<Text as="h2" {...style.title}>
									{deleteChatCopy.dialogTitle}
								</Text>
							</ResponsiveDialogTitle>
							<ResponsiveDialogDescription asChild>
								<Text as="p" {...style.description}>
									{deleteChatCopy.description}
								</Text>
							</ResponsiveDialogDescription>
							<Box asChild {...style.form}>
								<form
									method="post"
									action={paths.chatDeleteAction(chatId)}
									onSubmit={() => setIsSubmitted(true)}
								>
									<Grid {...style.buttons}>
										<ResponsiveDialogAction asChild>
											<Box asChild {...style.cancelButton}>
												<button type="button">
													<Text {...style.cancelText}>
														{deleteChatCopy.cancel}
													</Text>
												</button>
											</Box>
										</ResponsiveDialogAction>
										<Box asChild {...style.confirmButton}>
											<button type="submit" disabled={isSubmitted}>
												<Text {...style.confirmText}>
													{deleteChatCopy.confirm}
												</Text>
											</button>
										</Box>
									</Grid>
								</form>
							</Box>
						</VStack>
					</ResponsiveDialogBody>
				</ResponsiveDialogContent>
			</ResponsiveDialogPositioner>
		</>
	);
}

"use client";

import {
	Box,
	ResponsiveDialogRoot,
	ResponsiveDialogTrigger,
	Text,
	useBreakpointValue,
} from "@seed-design/react";
import { deleteChatCopy } from "@/features/deleteChat/config/deleteChatCopy";
import { deleteChatStyles } from "@/features/deleteChat/config/deleteChatStyles";
import DeleteChatDialog from "@/features/deleteChat/ui/DeleteChatDialog";

interface DeleteChatButtonProps {
	chatId: number;
	title: string;
	variant: "list" | "rail";
}

/**
 * 대화 삭제 > 버튼
 *
 * - 삭제 버튼을 누르면 확인 창을 엶
 * - 접근 가능한 이름은 삭제: 제목
 * - lg 미만은 바텀시트, lg 이상은 대화상자로 출력
 * - 화면 폭이 lg 경계를 넘으면 루트를 새로 만들어 열려 있던 창을 닫음
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
	const isBottomSheet = useBreakpointValue({ base: true, lg: false });

	return (
		<ResponsiveDialogRoot key={String(isBottomSheet)} dialogBreakpoint="lg">
			<ResponsiveDialogTrigger asChild>
				<Box asChild {...style.trigger[variant]}>
					<button
						type="button"
						aria-label={`${deleteChatCopy.label}: ${title}`}
					>
						<Text {...style.triggerText}>{deleteChatCopy.label}</Text>
					</button>
				</Box>
			</ResponsiveDialogTrigger>
			<DeleteChatDialog chatId={chatId} />
		</ResponsiveDialogRoot>
	);
}

import { Box, HStack, Icon, Text, VStack } from "@seed-design/react";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatThreadStyles } from "@/pages/chat/config/chatThreadStyles";
import ChatErrorIcon from "@/pages/chat/ui/ChatErrorIcon";

interface ChatErrorNoticeProps {
	code: "TOO_MANY_REQUESTS" | "SERVER_ERROR";
	onRetry: () => void;
}

/**
 * 채팅 > 오류 상자
 *
 * - role이 alert인 상자에 아이콘과 오류 문구, 다시 시도 버튼 출력
 * - 코드에 맞는 요청 제한 문구나 일시적 오류 문구 출력
 *
 * @param onRetry 다시 시도를 누르면 호출
 */
export default function ChatErrorNotice({
	code,
	onRetry,
}: ChatErrorNoticeProps) {
	const style = chatThreadStyles;
	const message = chatCopy.errorMessages[code];

	return (
		<VStack role="alert" data-area="chat-error" {...style.error}>
			<HStack {...style.errorRow}>
				<Icon svg={<ChatErrorIcon />} {...style.errorIcon} />
				<Text {...style.errorText}>{message}</Text>
			</HStack>
			<Box asChild {...style.retryButton}>
				<button type="button" onClick={onRetry}>
					<Text {...style.retryText}>{chatCopy.retry}</Text>
				</button>
			</Box>
		</VStack>
	);
}

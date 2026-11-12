import { Box, HStack, Icon, Text, VStack } from "@seed-design/react";
import { composerCopy } from "@/features/sendChatMessage/config/composerCopy";
import { composerStyles } from "@/features/sendChatMessage/config/composerStyles";
import LimitWarningIcon from "@/features/sendChatMessage/ui/LimitWarningIcon";

/**
 * 채팅 > 일일 한도 안내
 *
 * - 질문 입력 바 자리에 두는 section
 * - 경고 아이콘과 두 줄 안내 출력
 */
export default function ChatLimitNotice() {
	const style = composerStyles;

	return (
		<Box
			as="section"
			role="status"
			aria-label={composerCopy.limitLabel}
			data-area="chat-limit-notice"
			{...style.bar}
		>
			<HStack {...style.limitBox}>
				<Box {...style.limitIconCell}>
					<Icon svg={<LimitWarningIcon />} {...style.limitIcon} />
				</Box>
				<VStack {...style.limitText}>
					<Text {...style.limitTitle}>{composerCopy.limitTitle}</Text>
					<Text {...style.limitDescription}>
						{composerCopy.limitDescription}
					</Text>
				</VStack>
			</HStack>
		</Box>
	);
}

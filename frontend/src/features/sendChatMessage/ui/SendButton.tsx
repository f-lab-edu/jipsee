import IconArrowUpLine from "@karrotmarket/react-monochrome-icon/IconArrowUpLine";
import { Box, Icon } from "@seed-design/react";
import { composerCopy } from "@/features/sendChatMessage/config/composerCopy";
import { composerStyles } from "@/features/sendChatMessage/config/composerStyles";

interface SendButtonProps {
	isDisabled: boolean;
}

/**
 * 채팅 > 보내기 버튼
 *
 * - 비활성화되면 회색 배경과 흐린 아이콘으로 출력
 */
export default function SendButton({ isDisabled }: SendButtonProps) {
	const style = composerStyles;

	if (isDisabled) {
		return (
			<Box asChild {...style.sendButtonDisabled}>
				<button type="submit" aria-label={composerCopy.send} disabled>
					<Icon svg={<IconArrowUpLine />} {...style.sendIcon} />
				</button>
			</Box>
		);
	}

	return (
		<Box asChild {...style.sendButton}>
			<button type="submit" aria-label={composerCopy.send}>
				<Icon svg={<IconArrowUpLine />} {...style.sendIcon} />
			</button>
		</Box>
	);
}

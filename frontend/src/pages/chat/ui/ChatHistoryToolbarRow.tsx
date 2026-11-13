import { Box, HStack, Icon, Text } from "@seed-design/react";
import Link from "next/link";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import { paths } from "@/shared/routes/paths";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

interface ChatHistoryToolbarRowProps {
	layout: ResponsiveVariant;
}

/**
 * 채팅 > 대화 목록 도구줄 한 줄
 *
 * - 모바일은 제목 h1만 출력
 * - 데스크톱은 집사로 돌아가는 뒤로 가기 링크와 제목 h1 출력
 *
 * @param layout 글자 크기와 아래 테두리, 뒤로 가기 링크 출력 여부를 정함
 */
export default function ChatHistoryToolbarRow({
	layout,
}: ChatHistoryToolbarRowProps) {
	const style = chatScreenStyles.toolbar[layout];

	return (
		<HStack {...style.root}>
			<HStack {...style.titleGroup}>
				{layout === "desktop" && (
					<Box asChild {...style.backButton}>
						<Link href={paths.chat} aria-label={chatCopy.backToChat}>
							<Icon svg={<HeaderBackIcon />} {...style.backIcon} />
						</Link>
					</Box>
				)}
				<Text as="h1" {...style.title}>
					{chatCopy.historyTitle}
				</Text>
			</HStack>
		</HStack>
	);
}

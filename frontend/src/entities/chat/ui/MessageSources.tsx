import { Text, VStack } from "@seed-design/react";
import { chatMessageStyles } from "@/entities/chat/config/chatMessageStyles";
import type { ChatSource } from "@/entities/chat/model/chatSource";

interface MessageSourcesProps {
	sources: ChatSource[];
}

/**
 * 채팅 > 답변 출처 묶음
 *
 * - 출처마다 출처 줄을 출력하고 기준일 줄이 있으면 이어서 출력
 * - 링크 없는 평문
 */
export default function MessageSources({ sources }: MessageSourcesProps) {
	const style = chatMessageStyles;

	return (
		<VStack data-area="chat-sources" {...style.sources}>
			{sources.map((source) => (
				<VStack key={source.label}>
					<Text as="p" {...style.sourceLine}>
						{source.label}
					</Text>
					{source.baseLabel !== null && (
						<Text as="p" {...style.sourceLine}>
							{source.baseLabel}
						</Text>
					)}
				</VStack>
			))}
		</VStack>
	);
}

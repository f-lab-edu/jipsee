import { HStack, Icon, Text, VStack } from "@seed-design/react";
import { chatCopy } from "@/pages/chat/config/chatCopy";
import { chatScreenStyles } from "@/pages/chat/config/chatScreenStyles";
import BuildingChipIcon from "@/pages/chat/ui/BuildingChipIcon";

interface BuildingChipProps {
	name: string;
}

/**
 * 채팅 > 건물 칩
 *
 * - 건물 이름이나 주소 뒤에 기준을 붙여 출력
 * - 누르거나 지울 수 없는 표시 전용
 */
export default function BuildingChip({ name }: BuildingChipProps) {
	const style = chatScreenStyles;

	return (
		<VStack {...style.chipWrapper}>
			<HStack as="p" data-area="chat-building-chip" {...style.chip}>
				<Icon svg={<BuildingChipIcon />} {...style.chipIcon} />
				<Text {...style.chipText}>{`${name} ${chatCopy.buildingChip}`}</Text>
			</HStack>
		</VStack>
	);
}

import { Box, Icon, Text } from "@seed-design/react";
import Link from "next/link";
import { chatMessageCopy } from "@/entities/chat/config/chatMessageCopy";
import { chatMessageStyles } from "@/entities/chat/config/chatMessageStyles";
import type { ChatBuildingLink } from "@/entities/chat/model/chatBuildingLink";
import { paths } from "@/shared/routes/paths";
import ChevronRightIcon from "@/shared/ui/ChevronRightIcon";

interface MessageBuildingLinkProps {
	building: ChatBuildingLink;
}

/** 채팅 > 답변 속 건물 상세 링크 */
export default function MessageBuildingLink({
	building,
}: MessageBuildingLinkProps) {
	const style = chatMessageStyles;

	return (
		<Box asChild {...style.buildingLink}>
			<Link href={paths.building(building.id)}>
				<Text {...style.buildingLinkText}>
					{`${building.name} ${chatMessageCopy.buildingDetail}`}
				</Text>
				<Icon
					svg={<ChevronRightIcon strokeWidth={2.2} />}
					{...style.buildingLinkIcon}
				/>
			</Link>
		</Box>
	);
}

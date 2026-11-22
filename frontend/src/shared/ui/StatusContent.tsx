import { Box, Icon, Text, VStack } from "@seed-design/react";
import { statusAreas } from "@/shared/config/statusAreas";
import { statusCopy } from "@/shared/config/statusCopy";
import { statusPanelStyles } from "@/shared/config/statusStyles";
import type { StatusKind } from "@/shared/model/statusKind";
import StatusActions from "@/shared/ui/StatusActions";
import StatusIcon from "@/shared/ui/StatusIcon";
import StatusTitleLines from "@/shared/ui/StatusTitleLines";

interface StatusContentProps {
	kind: StatusKind;
	reset?: () => void;
}

const titleId = "status-title";

/**
 * 공통 > 상태 화면 내용
 *
 * - 원 안의 아이콘, 제목 h1, 설명(404만), 버튼 묶음 순서로 출력
 *
 * @param reset 오류 경계(error.tsx)가 넘겨 주는 복구 함수
 */
export default function StatusContent({ kind, reset }: StatusContentProps) {
	const style = statusPanelStyles;
	const copy = statusCopy[kind];

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area={statusAreas[kind]}
			{...style.root}
		>
			<Box {...style.circle}>
				<Icon svg={<StatusIcon kind={kind} />} {...style.icon} />
			</Box>
			<VStack {...style.textBlock}>
				<Text as="h1" id={titleId} {...style.title}>
					<StatusTitleLines lines={copy.titleLines} />
				</Text>
				{copy.description !== undefined && (
					<Text as="p" {...style.description}>
						{copy.description}
					</Text>
				)}
			</VStack>
			<StatusActions kind={kind} style={style} reset={reset} />
		</VStack>
	);
}

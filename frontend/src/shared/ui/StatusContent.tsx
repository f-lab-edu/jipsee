import { Box, Icon, Text, VStack } from "@seed-design/react";
import { statusAreas } from "@/shared/config/statusAreas";
import { statusCopy } from "@/shared/config/statusCopy";
import { statusStyles } from "@/shared/config/statusStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import type { StatusKind } from "@/shared/model/statusKind";
import StatusActions from "@/shared/ui/StatusActions";
import StatusIcon from "@/shared/ui/StatusIcon";
import StatusTitleLines from "@/shared/ui/StatusTitleLines";

interface StatusContentProps {
	layout: ResponsiveVariant;
	kind: StatusKind;
	reset?: () => void;
}

const titleId = "status-title";

/**
 * 공통 > 상태 화면 내용
 *
 * - 원 안의 아이콘, 제목 h1, 설명(404만), 버튼 묶음 순서로 출력
 *
 * @param layout 크기를 정하는 모바일 또는 데스크톱 레이아웃
 * @param reset 오류 경계(error.tsx)가 넘겨 주는 복구 함수
 */
export default function StatusContent({
	layout,
	kind,
	reset,
}: StatusContentProps) {
	const style = statusStyles[layout];
	const copy = statusCopy[kind];

	return (
		<VStack
			as="section"
			aria-labelledby={`${titleId}-${layout}`}
			data-area={statusAreas[kind]}
			{...style.root}
		>
			<Box {...style.circle}>
				<Icon svg={<StatusIcon kind={kind} />} {...style.icon} />
			</Box>
			<VStack {...style.textBlock}>
				<Text as="h1" id={`${titleId}-${layout}`} {...style.title}>
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

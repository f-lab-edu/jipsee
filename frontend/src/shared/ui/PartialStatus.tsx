import { Box, Icon, Text, VStack } from "@seed-design/react";
import { partialStatusStyles } from "@/shared/config/partialStatusStyles";
import { partialStatusAreas } from "@/shared/config/statusAreas";
import { statusCopy } from "@/shared/config/statusCopy";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import type { RetryableStatusKind } from "@/shared/model/statusKind";
import RetryButton from "@/shared/ui/RetryButton";
import StatusIcon from "@/shared/ui/StatusIcon";
import StatusTitleLines from "@/shared/ui/StatusTitleLines";

interface PartialStatusProps {
	layout: ResponsiveVariant;
	kind: RetryableStatusKind;
}

/**
 * 공통 > 영역 상태
 *
 * - 화면 일부만 실패했을 때 그 영역 안에 아이콘, 제목, 다시 시도 버튼 출력
 * - 제목은 role="alert"로 안내
 * - 다시 시도는 서버 데이터를 다시 요청해 영역 새로 그리기
 */
export default function PartialStatus({ layout, kind }: PartialStatusProps) {
	const style = partialStatusStyles[layout];

	return (
		<VStack data-area={partialStatusAreas[kind]} {...style.root}>
			<Box {...style.circle}>
				<Icon svg={<StatusIcon kind={kind} />} {...style.icon} />
			</Box>
			<Text as="p" role="alert" {...style.title}>
				<StatusTitleLines lines={statusCopy[kind].titleLines} />
			</Text>
			<RetryButton style={style.retryButton} textStyle={style.retryText} />
		</VStack>
	);
}

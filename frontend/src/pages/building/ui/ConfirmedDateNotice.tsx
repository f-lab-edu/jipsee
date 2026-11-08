import { Box, Icon, Text } from "@seed-design/react";
import { confirmedDateNoticeStyles } from "@/pages/building/config/confirmedDateNoticeStyles";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import BaseMonthNoticeIcon from "@/widgets/searchGuide/ui/BaseMonthNoticeIcon";

interface ConfirmedDateNoticeProps {
	layout: ResponsiveVariant;
}

/**
 * 건물 상세 > 확정일자 안내
 *
 * - 확정일자 기준 거래라 최근 거래가 빠질 수 있다는 안내를 `role="note"` 상자로 출력
 * - 모바일은 위쪽 정렬에 작은 아이콘, 데스크톱은 세로 가운데 정렬에 큰 아이콘
 *
 * @param layout 안쪽 여백과 정렬, 아이콘 크기를 정함
 */
export default function ConfirmedDateNotice({
	layout,
}: ConfirmedDateNoticeProps) {
	const style = confirmedDateNoticeStyles[layout];

	return (
		<Box role="note" {...style.notice}>
			<Box {...style.iconCell}>
				<Icon svg={<BaseMonthNoticeIcon />} {...style.icon} />
			</Box>
			<Text as="p" {...style.text}>
				{nearbyDealsCopy.confirmedDateNotice}
			</Text>
		</Box>
	);
}

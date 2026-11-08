import IconExclamationmarkCircleLine from "@karrotmarket/react-monochrome-icon/IconExclamationmarkCircleLine";
import { Box, Icon, Text } from "@seed-design/react";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import { nearbyDealsNoticeStyles } from "@/pages/building/config/nearbyDealsNoticeStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsNoticeProps {
	layout: ResponsiveVariant;
	title: string;
}

/**
 * 건물 상세 > 조건 확장 안내
 *
 * - 거래가 적을 때 건수 제목과 조건을 넓히라는 본문을 `role="note"` 상자로 출력
 * - 모바일과 데스크톱 모두 위쪽 정렬이고 아이콘 크기만 다름
 *
 * @param layout 안쪽 여백과 아이콘 크기를 정함
 * @param title 건수나 거래가 없다는 제목
 */
export default function NearbyDealsNotice({
	layout,
	title,
}: NearbyDealsNoticeProps) {
	const style = nearbyDealsNoticeStyles[layout];

	return (
		<Box
			role="note"
			data-area={`nearby-expand-notice-${layout}`}
			{...style.notice}
		>
			<Box {...style.iconCell}>
				<Icon svg={<IconExclamationmarkCircleLine />} {...style.icon} />
			</Box>
			<Box {...style.textGroup}>
				<Text as="p" {...style.title}>
					{title}
				</Text>
				<Text as="p" {...style.body}>
					{nearbyDealsCopy.noticeBody}
				</Text>
			</Box>
		</Box>
	);
}

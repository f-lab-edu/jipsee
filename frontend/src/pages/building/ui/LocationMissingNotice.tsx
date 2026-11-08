import { Box, Icon, Text } from "@seed-design/react";
import { locationMissingNoticeStyles } from "@/pages/building/config/locationMissingNoticeStyles";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import LocationMissingIcon from "@/pages/building/ui/LocationMissingIcon";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface LocationMissingNoticeProps {
	layout: ResponsiveVariant;
}

/**
 * 건물 상세 > 위치 정보 없음 안내
 *
 * - 위치 정보가 없어 주변 거래를 보여줄 수 없다는 안내를 `role="note"` 상자로 출력
 * - 모바일은 위쪽 정렬에 작은 아이콘, 데스크톱은 세로 가운데 정렬에 큰 아이콘
 *
 * @param layout 안쪽 여백과 정렬, 아이콘 크기를 정함
 */
export default function LocationMissingNotice({
	layout,
}: LocationMissingNoticeProps) {
	const style = locationMissingNoticeStyles[layout];

	return (
		<Box role="note" {...style.notice}>
			<Box {...style.iconCell}>
				<Icon svg={<LocationMissingIcon />} {...style.icon} />
			</Box>
			<Text as="p" {...style.text}>
				{nearbyDealsCopy.locationMissing}
			</Text>
		</Box>
	);
}

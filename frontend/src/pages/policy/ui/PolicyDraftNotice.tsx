import { Box, Icon, Text } from "@seed-design/react";
import { policyContentStyles } from "@/pages/policy/config/policyStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import BaseMonthNoticeIcon from "@/widgets/searchGuide/ui/BaseMonthNoticeIcon";

interface PolicyDraftNoticeProps {
	area: string;
	layout: ResponsiveVariant;
	text: string;
}

/**
 * 정책 > 임시 초안 안내
 *
 * - 법률 검토 전 임시 본문이라는 안내를 정보 아이콘과 함께 `role="note"` 상자로 출력
 *
 * @param area `data-area` 접두사. 문서와 데이터 출처 화면이 따로 씀
 */
export default function PolicyDraftNotice({
	area,
	layout,
	text,
}: PolicyDraftNoticeProps) {
	const style = policyContentStyles[layout];

	return (
		<Box
			role="note"
			data-area={`${area}-draft-notice-${layout}`}
			{...style.draftNotice}
		>
			<Box {...style.draftNoticeIconCell}>
				<Icon svg={<BaseMonthNoticeIcon />} {...style.draftNoticeIcon} />
			</Box>
			<Text as="p" {...style.draftNoticeText}>
				{text}
			</Text>
		</Box>
	);
}

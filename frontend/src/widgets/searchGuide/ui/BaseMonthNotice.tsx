import { Box, Icon } from "@seed-design/react";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import { baseMonthNoticeStyles } from "@/widgets/searchGuide/config/baseMonthNoticeStyles";
import BaseMonthNoticeContent from "@/widgets/searchGuide/ui/BaseMonthNoticeContent";
import BaseMonthNoticeIcon from "@/widgets/searchGuide/ui/BaseMonthNoticeIcon";

interface BaseMonthNoticeProps {
	testId: string;
	baseMonth: YearMonth;
}

/**
 * 검색 안내 > 기준 월 안내
 *
 * - 모바일은 정보 아이콘이 있는 박스, 데스크톱은 아이콘 없는 오른쪽 정렬 박스 출력
 *
 * @param testId 한 화면에 두 번 쓰이므로 호출하는 쪽이 정하는 data-testid와 data-area 접두사
 * @param baseMonth 안내에 표시할 실거래 기준 월
 */
export default function BaseMonthNotice({
	testId,
	baseMonth,
}: BaseMonthNoticeProps) {
	const mobileStyle = baseMonthNoticeStyles.mobile;

	return (
		<ResponsiveLayout
			testId={testId}
			mobile={
				<BaseMonthNoticeContent
					style={mobileStyle}
					baseMonth={baseMonth}
					icon={
						<Box {...mobileStyle.iconCell}>
							<Icon svg={<BaseMonthNoticeIcon />} {...mobileStyle.icon} />
						</Box>
					}
				/>
			}
			desktop={
				<BaseMonthNoticeContent
					style={baseMonthNoticeStyles.desktop}
					baseMonth={baseMonth}
				/>
			}
		/>
	);
}

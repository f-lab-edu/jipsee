import { Box, Icon } from "@seed-design/react";
import { baseMonthNoticeStyles } from "@/pages/home/config/baseMonthNoticeStyles";
import BaseMonthNoticeContent from "@/pages/home/ui/BaseMonthNoticeContent";
import BaseMonthNoticeIcon from "@/pages/home/ui/BaseMonthNoticeIcon";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

interface BaseMonthNoticeProps {
	baseMonth: YearMonth;
}

/**
 * 홈 > 기준 월 안내
 *
 * - 모바일은 정보 아이콘이 있는 박스, 데스크톱은 아이콘 없는 오른쪽 정렬 박스 출력
 *
 * @param baseMonth 안내에 표시할 실거래 기준 월
 */
export default function BaseMonthNotice({ baseMonth }: BaseMonthNoticeProps) {
	const mobileStyle = baseMonthNoticeStyles.mobile;

	return (
		<ResponsiveLayout
			testId="base-month-notice"
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

import { Flex, Text } from "@seed-design/react";
import type { ReactNode } from "react";
import { searchGuideCopy } from "@/pages/home/config/searchGuideCopy";
import type { BaseMonthNoticeStyle } from "@/pages/home/model/baseMonthNoticeStyle";
import { formatYearMonthWithUnit } from "@/shared/lib/dates/formatYearMonthWithUnit";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";

interface BaseMonthNoticeContentProps {
	style: BaseMonthNoticeStyle;
	baseMonth: YearMonth;
	icon?: ReactNode;
}

/**
 * 홈 > 기준 월 안내 내용
 *
 * - 기준 월 실거래 정보 부분만 굵게 출력
 * - 아이콘은 넘겨받은 경우에만 글자 앞에 출력
 *
 * @param style 모바일 또는 데스크톱 레이아웃의 스타일
 */
export default function BaseMonthNoticeContent({
	style,
	baseMonth,
	icon,
}: BaseMonthNoticeContentProps) {
	const baseMonthText = `${formatYearMonthWithUnit(baseMonth)} ${searchGuideCopy.baseMonthLabel}`;

	return (
		<Flex {...style.root}>
			{icon}
			<Text as="p" {...style.text}>
				<Text as="span" {...style.highlight}>
					{baseMonthText}
				</Text>
				{searchGuideCopy.baseMonthSuffix}
				<br />
				{searchGuideCopy.missingNotice}
			</Text>
		</Flex>
	);
}

import { Flex, Text } from "@seed-design/react";
import type { ReactNode } from "react";
import { formatYearMonthWithUnit } from "@/shared/lib/dates/formatYearMonthWithUnit";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import type { BaseMonthNoticeStyle } from "@/widgets/searchGuide/config/baseMonthNoticeStyles";
import { searchGuideCopy } from "@/widgets/searchGuide/config/searchGuideCopy";

interface BaseMonthNoticeContentProps {
	style: BaseMonthNoticeStyle;
	baseMonth: Nullable<YearMonth>;
	icon?: ReactNode;
}

/**
 * 검색 안내 > 기준 월 안내 내용
 *
 * - 기준 월 실거래 정보 부분만 굵게 출력
 * - 기준 월이 없으면 첫 줄을 출력하지 않음
 * - 아이콘은 넘겨받은 경우에만 글자 앞에 출력
 *
 * @param style 모바일 또는 데스크톱 레이아웃의 스타일
 */
export default function BaseMonthNoticeContent({
	style,
	baseMonth,
	icon,
}: BaseMonthNoticeContentProps) {
	return (
		<Flex {...style.root}>
			{icon}
			<Text as="p" {...style.text}>
				{baseMonth && (
					<>
						<Text as="span" {...style.highlight}>
							{`${formatYearMonthWithUnit(baseMonth)} ${searchGuideCopy.baseMonthLabel}`}
						</Text>
						{searchGuideCopy.baseMonthSuffix}
						<br />
					</>
				)}
				{searchGuideCopy.missingNotice}
			</Text>
		</Flex>
	);
}

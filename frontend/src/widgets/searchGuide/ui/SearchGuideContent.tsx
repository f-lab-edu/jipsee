import IconClockLine from "@karrotmarket/react-monochrome-icon/IconClockLine";
import IconSlashCircleLine from "@karrotmarket/react-monochrome-icon/IconSlashCircleLine";
import { Grid, Icon, Text, VStack } from "@seed-design/react";
import { formatYearMonthWithUnit } from "@/shared/lib/dates/formatYearMonthWithUnit";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import { searchGuideCopy } from "@/widgets/searchGuide/config/searchGuideCopy";
import type { SearchGuideLayoutStyle } from "@/widgets/searchGuide/model/searchGuideLayoutStyle";
import SearchGuideCheckIcon from "@/widgets/searchGuide/ui/SearchGuideCheckIcon";
import SearchGuideItem from "@/widgets/searchGuide/ui/SearchGuideItem";

interface SearchGuideContentProps {
	style: SearchGuideLayoutStyle;
	baseMonth: YearMonth;
}

/**
 * 검색 안내 > 내용
 *
 * - 제목 아래에 항목 세 개 출력
 * - 셋째 항목은 기준 월 실거래 정보 부분만 굵게 출력
 *
 * @param style 모바일 또는 데스크톱 레이아웃의 스타일
 */
export default function SearchGuideContent({
	style,
	baseMonth,
}: SearchGuideContentProps) {
	const baseMonthText = `${formatYearMonthWithUnit(baseMonth)} ${searchGuideCopy.baseMonthLabel}`;

	return (
		<VStack {...style.root}>
			<VStack {...style.panel}>
				<Text as="h2" {...style.title}>
					{searchGuideCopy.title}
				</Text>
				<Grid {...style.items}>
					<SearchGuideItem
						style={style}
						icon={<Icon svg={<SearchGuideCheckIcon />} {...style.checkIcon} />}
					>
						{searchGuideCopy.availableItem}
					</SearchGuideItem>
					<SearchGuideItem
						style={style}
						icon={<Icon svg={<IconSlashCircleLine />} {...style.slashIcon} />}
					>
						{searchGuideCopy.unavailableItem}
					</SearchGuideItem>
					<SearchGuideItem
						style={style}
						icon={<Icon svg={<IconClockLine />} {...style.clockIcon} />}
					>
						<Text as="span" {...style.highlight}>
							{baseMonthText}
						</Text>
						{searchGuideCopy.baseMonthSuffix}
						<br />
						{searchGuideCopy.missingNotice}
					</SearchGuideItem>
				</Grid>
			</VStack>
		</VStack>
	);
}

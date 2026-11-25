import IconClockLine from "@karrotmarket/react-monochrome-icon/IconClockLine";
import IconSlashCircleLine from "@karrotmarket/react-monochrome-icon/IconSlashCircleLine";
import { Grid, Icon, Text, VStack } from "@seed-design/react";
import { formatYearMonthWithUnit } from "@/shared/lib/dates/formatYearMonthWithUnit";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { searchGuideCopy } from "@/widgets/searchGuide/config/searchGuideCopy";
import type { SearchGuideLayoutStyle } from "@/widgets/searchGuide/config/searchGuideStyles";
import SearchGuideCheckIcon from "@/widgets/searchGuide/ui/SearchGuideCheckIcon";
import SearchGuideItem from "@/widgets/searchGuide/ui/SearchGuideItem";

interface SearchGuideContentProps {
	style: SearchGuideLayoutStyle;
	baseMonth: Nullable<YearMonth>;
}

/**
 * 검색 안내 > 내용
 *
 * - 제목 아래에 항목 세 개 출력
 * - 셋째 항목은 기준 월 실거래 정보 부분만 굵게 출력
 * - 기준 월이 없으면 셋째 항목의 첫 줄을 출력하지 않음
 *
 * @param style 모바일 또는 데스크톱 레이아웃의 스타일
 */
export default function SearchGuideContent({
	style,
	baseMonth,
}: SearchGuideContentProps) {
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
					</SearchGuideItem>
				</Grid>
			</VStack>
		</VStack>
	);
}

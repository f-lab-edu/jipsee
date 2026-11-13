import { Box, Flex, Text, VStack } from "@seed-design/react";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import { searchPanelStyles } from "@/pages/search/config/searchPanelStyles";
import { introCopy } from "@/shared/config/introCopy";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import BaseMonthNotice from "@/widgets/searchGuide/ui/BaseMonthNotice";

interface SearchPanelProps {
	keyword: string;
	baseMonth: YearMonth;
	showsNoticeOnMobile: boolean;
	invalid: boolean;
}

/**
 * 검색 > 검색 영역
 *
 * - 데스크톱은 흰 패널 안에 제목 줄, 검색창 순서로 출력
 * - 제목 줄 오른쪽에 기준 월 안내를 아래쪽 끝에 맞춰 출력
 * - 모바일은 검색창이 헤더에 있어 패널과 검색창 없이 기준 월 안내만 출력
 *
 * @param keyword 검색창의 초기 검색어. 바뀌면 검색창을 새로 만듦
 * @param showsNoticeOnMobile 모바일에서 기준 월 안내를 출력할지 여부. 데스크톱은 항상 출력
 * @param invalid 검색어가 2자 미만인지 여부. 데스크톱 검색창의 오류 줄 출력 여부
 */
export default function SearchPanel({
	keyword,
	baseMonth,
	showsNoticeOnMobile,
	invalid,
}: SearchPanelProps) {
	const style = searchPanelStyles;

	return (
		<Box data-area="search-panel" {...style.root}>
			<Box {...style.background} />
			<VStack {...style.content}>
				<Flex {...style.titleRow}>
					<VStack {...style.titleBlock}>
						<Text as="h1" {...style.title}>
							{`${introCopy.titleFirstLine} ${introCopy.titleSecondLine}`}
						</Text>
						<Text as="p" {...style.description}>
							{introCopy.description}
						</Text>
					</VStack>
					<Box data-area="search-panel-notice" {...style.desktopNoticeCell}>
						<BaseMonthNotice
							testId="search-panel-base-month"
							baseMonth={baseMonth}
						/>
					</Box>
				</Flex>
				<Box data-area="search-panel-form" {...style.formCell}>
					<SearchForm
						key={keyword}
						defaultValue={keyword}
						variant="compact"
						invalid={invalid}
					/>
				</Box>
				{showsNoticeOnMobile && (
					<Box data-area="search-mobile-notice" {...style.mobileNoticeCell}>
						<BaseMonthNotice
							testId="search-mobile-base-month"
							baseMonth={baseMonth}
						/>
					</Box>
				)}
			</VStack>
		</Box>
	);
}

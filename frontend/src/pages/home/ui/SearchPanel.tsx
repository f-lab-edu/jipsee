import { Box, Flex, Text, VStack } from "@seed-design/react";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import { introCopy } from "@/pages/home/config/introCopy";
import { searchPanelStyles } from "@/pages/home/config/searchPanelStyles";
import BaseMonthNotice from "@/pages/home/ui/BaseMonthNotice";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";

interface SearchPanelProps {
	keyword: string;
	baseMonth: YearMonth;
	showsNoticeOnMobile: boolean;
}

/**
 * 홈 > 검색 영역
 *
 * - 데스크톱은 흰 패널 안에 제목 줄, 검색창 순서로 출력
 * - 제목 줄 오른쪽에 기준 월 안내를 아래쪽 끝에 맞춰 출력
 * - 모바일은 패널 없이 검색창 아래에 기준 월 안내 출력
 * - 검색창은 하나만 출력
 *
 * @param keyword 검색창의 초기 검색어. 바뀌면 검색창을 새로 만듦
 * @param showsNoticeOnMobile 모바일에서 기준 월 안내를 출력할지 여부. 데스크톱은 항상 출력
 */
export default function SearchPanel({
	keyword,
	baseMonth,
	showsNoticeOnMobile,
}: SearchPanelProps) {
	const style = searchPanelStyles;

	return (
		<Box {...style.root}>
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
					<Box {...style.desktopNoticeCell}>
						<BaseMonthNotice baseMonth={baseMonth} />
					</Box>
				</Flex>
				<SearchForm key={keyword} defaultValue={keyword} variant="compact" />
				{showsNoticeOnMobile && (
					<Box {...style.mobileNoticeCell}>
						<BaseMonthNotice baseMonth={baseMonth} />
					</Box>
				)}
			</VStack>
		</Box>
	);
}

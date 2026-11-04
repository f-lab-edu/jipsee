import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import { searchGuideStyles } from "@/widgets/searchGuide/config/searchGuideStyles";
import SearchGuideContent from "@/widgets/searchGuide/ui/SearchGuideContent";

interface SearchGuideProps {
	baseMonth: YearMonth;
}

/**
 * 검색 안내
 *
 * - 모바일과 데스크톱 모두 제목과 항목 세 줄을 카드 하나에 출력
 *
 * @param baseMonth 안내 항목에 표시할 실거래 기준 월
 */
export default function SearchGuide({ baseMonth }: SearchGuideProps) {
	return (
		<ResponsiveLayout
			testId="search-guide"
			mobile={
				<SearchGuideContent
					style={searchGuideStyles.mobile}
					baseMonth={baseMonth}
				/>
			}
			desktop={
				<SearchGuideContent
					style={searchGuideStyles.desktop}
					baseMonth={baseMonth}
				/>
			}
		/>
	);
}

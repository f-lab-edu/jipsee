import { Box } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { searchFormRowStyles } from "@/widgets/header/config/searchFormRowStyles";
import Header from "@/widgets/header/ui/Header";
import HeaderBackLink from "@/widgets/header/ui/HeaderBackLink";

interface SearchHeaderProps {
	session: Nullable<Session>;
	keyword: string;
	invalid: boolean;
}

/**
 * 헤더 > 검색 헤더
 *
 * - 모바일은 로고 왼쪽에 홈으로 가는 뒤로 가기 링크를 두고 배경은 투명
 * - 모바일 둘째 줄에 검색어가 채워진 검색창 출력
 *
 * @param keyword 모바일 검색창의 초기 검색어. 바뀌면 검색창을 새로 만듦
 * @param invalid 검색어가 2자 미만인지 여부. 모바일 검색창의 오류 줄 출력 여부
 */
export default function SearchHeader({
	session,
	keyword,
	invalid,
}: SearchHeaderProps) {
	const style = searchFormRowStyles;

	return (
		<Header
			session={session}
			mobileBackground="transparent"
			mobileBack={<HeaderBackLink />}
			mobileBottom={
				<Box data-area="mobile-search-form" {...style.cell}>
					<SearchForm
						key={keyword}
						defaultValue={keyword}
						variant="compact"
						invalid={invalid}
					/>
				</Box>
			}
		/>
	);
}

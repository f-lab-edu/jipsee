import { Box, HStack, Icon } from "@seed-design/react";
import Link from "next/link";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import { backButtonCopy } from "@/shared/config/backButtonCopy";
import { paths } from "@/shared/routes/paths";
import { mobileSearchHeaderStyles } from "@/widgets/header/config/mobileSearchHeaderStyles";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

interface MobileSearchHeaderProps {
	keyword: string;
	invalid: boolean;
}

/**
 * 헤더 > 모바일 검색 레이아웃
 *
 * - 왼쪽에 홈으로 가는 뒤로 가기 링크 출력
 * - 오른쪽에 검색어가 채워진 검색창 출력
 * - invalid일 때 검색창 아래에 오류 줄 출력하고 행 높이를 늘림
 * - 배경은 투명
 *
 * @param keyword 검색창의 초기 검색어. 바뀌면 검색창을 새로 만듦
 * @param invalid 검색어가 2자 미만인지 여부
 */
export default function MobileSearchHeader({
	keyword,
	invalid,
}: MobileSearchHeaderProps) {
	const style = mobileSearchHeaderStyles;

	return (
		<HStack {...style.row}>
			<Box asChild {...style.backLink}>
				<Link href={paths.home} aria-label={backButtonCopy.label}>
					<Icon svg={<HeaderBackIcon />} {...style.backIcon} />
				</Link>
			</Box>
			<Box data-area="mobile-search-form" {...style.formCell}>
				<SearchForm
					key={keyword}
					defaultValue={keyword}
					variant="compact"
					invalid={invalid}
				/>
			</Box>
		</HStack>
	);
}

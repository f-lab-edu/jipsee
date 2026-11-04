import { Box, HStack, Icon } from "@seed-design/react";
import Link from "next/link";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import { paths } from "@/shared/routes/paths";
import { mobileSearchHeaderStyles } from "@/widgets/header/config/mobileSearchHeaderStyles";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

interface MobileSearchHeaderProps {
	keyword: string;
}

/**
 * 헤더 > 모바일 검색 레이아웃
 *
 * - 왼쪽에 홈으로 가는 뒤로 가기 링크 출력
 * - 오른쪽에 검색어가 채워진 검색창 출력
 * - 배경은 투명
 *
 * @param keyword 검색창의 초기 검색어. 바뀌면 검색창을 새로 만듦
 */
export default function MobileSearchHeader({
	keyword,
}: MobileSearchHeaderProps) {
	const style = mobileSearchHeaderStyles;

	return (
		<HStack {...style.row}>
			<Box asChild {...style.backLink}>
				<Link href={paths.home} aria-label="뒤로 가기">
					<Icon svg={<HeaderBackIcon />} {...style.backIcon} />
				</Link>
			</Box>
			<Box {...style.formCell}>
				<SearchForm key={keyword} defaultValue={keyword} variant="compact" />
			</Box>
		</HStack>
	);
}

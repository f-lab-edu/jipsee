import { Box, Icon, Text } from "@seed-design/react";
import Link from "next/link";
import { homeBackLinkStyles } from "@/pages/search/config/homeBackLinkStyles";
import HomeBackLinkIcon from "@/pages/search/ui/HomeBackLinkIcon";
import { paths } from "@/shared/routes/paths";

/**
 * 검색 > 홈으로 링크
 *
 * - 데스크톱에서만 출력
 * - 홈으로 이동하는 링크를 왼쪽 화살표와 함께 출력
 */
export default function HomeBackLink() {
	const style = homeBackLinkStyles;

	return (
		<Box asChild {...style.link}>
			<Link href={paths.home}>
				<Icon svg={<HomeBackLinkIcon />} {...style.icon} />
				<Text {...style.label}>홈으로</Text>
			</Link>
		</Box>
	);
}

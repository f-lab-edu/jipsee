import { Box } from "@seed-design/react";
import { getRentDealBaseMonth } from "@/entities/dataSource/api/getRentDealBaseMonth";
import type { Session } from "@/entities/session/model/session";
import { homePageStyles } from "@/pages/home/config/homePageStyles";
import HomeScreen from "@/pages/home/ui/HomeScreen";
import IntroBand from "@/pages/home/ui/IntroBand";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import SearchGuide from "@/widgets/searchGuide/ui/SearchGuide";

interface HomePageProps {
	session: Nullable<Session>;
}

/**
 * 홈 > 페이지
 *
 * - 검색 전 소개 영역과 검색 안내 출력
 */
export default async function HomePage({ session }: HomePageProps) {
	const style = homePageStyles;
	const baseMonth = await getRentDealBaseMonth();

	return (
		<HomeScreen session={session}>
			<Box {...style.introWrapper}>
				<IntroBand />
				<Box {...style.guideCell}>
					<SearchGuide baseMonth={baseMonth} />
				</Box>
			</Box>
		</HomeScreen>
	);
}

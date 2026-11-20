import { VStack } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { buildingScreenStyles } from "@/pages/building/config/buildingScreenStyles";
import { buildingStatusStyles } from "@/pages/building/config/buildingStatusStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import ContentContainer from "@/shared/ui/ContentContainer";
import PageColumn from "@/shared/ui/PageColumn";
import PartialStatusPanel from "@/shared/ui/PartialStatusPanel";
import BottomNav from "@/widgets/bottomNav/ui/BottomNav";
import Footer from "@/widgets/footer/ui/Footer";
import BuildingHeader from "@/widgets/header/ui/BuildingHeader";

interface BuildingStatusScreenProps {
	buildingId: number;
	session: Nullable<Session>;
}

/**
 * 건물 상세 > 요청 제한 화면
 *
 * - 건물 상세 화면의 헤더, 푸터, 하단 내비게이션은 그대로 두고 본문만 요청 제한 안내로 대신 출력
 */
export default function BuildingStatusScreen({
	buildingId,
	session,
}: BuildingStatusScreenProps) {
	const style = buildingScreenStyles;

	return (
		<PageColumn>
			<BuildingHeader
				session={session}
				currentPath={paths.building(buildingId)}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<ContentContainer>
					<VStack {...buildingStatusStyles.body}>
						<PartialStatusPanel kind="rateLimited" />
					</VStack>
				</ContentContainer>
			</VStack>
			<Footer />
			<BottomNav session={session} />
		</PageColumn>
	);
}

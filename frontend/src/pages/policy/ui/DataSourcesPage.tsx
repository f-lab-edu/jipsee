import { Text, VStack } from "@seed-design/react";
import type { DataSourceCardItem } from "@/entities/dataSource/model/dataSourceCardItem";
import type { Session } from "@/entities/session/model/session";
import { dataSourcesCopy } from "@/pages/policy/config/dataSourcesCopy";
import { dataSourcesScreenStyles } from "@/pages/policy/config/dataSourcesScreenStyles";
import { policyScreenStyles } from "@/pages/policy/config/policyStyles";
import DataSourcesCards from "@/pages/policy/ui/DataSourcesCards";
import DataSourcesNotice from "@/pages/policy/ui/DataSourcesNotice";
import PolicyDraftNotice from "@/pages/policy/ui/PolicyDraftNotice";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface DataSourcesPageProps {
	session: Nullable<Session>;
	items: readonly DataSourceCardItem[];
}

/**
 * 데이터 출처 > 화면
 *
 * - 뒤로 가기가 있는 로고 헤더 출력
 * - 제목, 임시 초안 안내, 출처 카드 목록, 한계 안내 순서로 출력
 * - 제목 h1은 모바일과 데스크톱이 같은 요소를 쓰고 글자 크기와 위치만 반응형으로 바꿈
 * - 모바일은 하늘빛 배경 위 카드(main) 본문, 데스크톱은 하늘빛 배경 위 폭 720 열
 */
export default function DataSourcesPage({
	session,
	items,
}: DataSourcesPageProps) {
	const style = policyScreenStyles;
	const screen = dataSourcesScreenStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={paths.dataSources}
				mobileBack={<HeaderBackButton />}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<VStack data-area="data-sources-title" {...screen.titleBox}>
					<Text as="h1" {...screen.title}>
						{dataSourcesCopy.title}
					</Text>
				</VStack>
				<ResponsiveLayout
					testId="data-sources-body"
					fillsHeight
					mobile={
						<VStack {...screen.mobileBody}>
							<PolicyDraftNotice
								area="data-sources"
								layout="mobile"
								text={dataSourcesCopy.draftNotice}
							/>
							<DataSourcesCards layout="mobile" items={items} />
							<DataSourcesNotice layout="mobile" />
						</VStack>
					}
					desktop={
						<VStack {...screen.desktopBody}>
							<VStack data-area="data-sources-column" {...screen.desktopColumn}>
								<PolicyDraftNotice
									area="data-sources"
									layout="desktop"
									text={dataSourcesCopy.draftNotice}
								/>
								<DataSourcesCards layout="desktop" items={items} />
								<DataSourcesNotice layout="desktop" />
							</VStack>
						</VStack>
					}
				/>
			</VStack>
		</>
	);
}

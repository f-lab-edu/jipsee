import { Box, Text, VStack } from "@seed-design/react";
import type { DataSourceCardItem } from "@/entities/dataSource/model/dataSourceCardItem";
import type { Session } from "@/entities/session/model/session";
import { dataSourcesCopy } from "@/pages/policy/config/dataSourcesCopy";
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
 * - 모바일은 흰 배경 본문, 데스크톱은 하늘빛 배경 위 폭 480 열
 */
export default function DataSourcesPage({
	session,
	items,
}: DataSourcesPageProps) {
	const style = policyScreenStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={paths.dataSources}
				mobileBackground="bg.layerDefault"
				mobileBack={<HeaderBackButton />}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<ResponsiveLayout
					testId="data-sources-body"
					fillsHeight
					mobile={
						<VStack {...style.mobileBody}>
							<Box data-area="data-sources-title-mobile">
								<Text as="h1" {...style.mobileTitle}>
									{dataSourcesCopy.title}
								</Text>
							</Box>
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
						<VStack {...style.desktopBody}>
							<VStack data-area="data-sources-column" {...style.desktopColumn}>
								<Text as="h1" {...style.desktopTitle}>
									{dataSourcesCopy.title}
								</Text>
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

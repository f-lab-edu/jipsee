import { Box, Text, VStack } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { meCopy } from "@/pages/me/config/meCopy";
import { meStyles } from "@/pages/me/config/meStyles";
import ProviderSection from "@/pages/me/ui/ProviderSection";
import { paths } from "@/shared/routes/paths";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface MePageProps {
	session: Session;
}

/**
 * 내 정보 > 페이지
 *
 * - 뒤로 가기가 있는 로고 헤더 출력
 * - 모바일은 흰 배경 본문 첫 줄에 제목, 데스크톱은 하늘빛 배경 위 폭 480 열에 제목과 카드 출력
 */
export default function MePage({ session }: MePageProps) {
	const style = meStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={paths.me}
				mobileBackground="bg.layerDefault"
				mobileBack={<HeaderBackButton />}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<ResponsiveLayout
					testId="me-body"
					fillsHeight
					mobile={
						<VStack {...style.mobileBody}>
							<Box data-area="me-title-mobile" {...style.mobileTitleBox}>
								<Text as="h1" {...style.mobileTitle}>
									{meCopy.title}
								</Text>
							</Box>
							<ProviderSection layout="mobile" provider={session.provider} />
						</VStack>
					}
					desktop={
						<VStack {...style.desktopBody}>
							<VStack data-area="me-column" {...style.desktopColumn}>
								<Box {...style.desktopTitleBox}>
									<Text as="h1" {...style.desktopTitle}>
										{meCopy.title}
									</Text>
								</Box>
								<ProviderSection layout="desktop" provider={session.provider} />
							</VStack>
						</VStack>
					}
				/>
			</VStack>
		</>
	);
}

import { Box, Text, VStack } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { meCopy } from "@/pages/me/config/meCopy";
import { meStyles } from "@/pages/me/config/meStyles";
import PolicySection from "@/pages/me/ui/PolicySection";
import ProviderSection from "@/pages/me/ui/ProviderSection";
import WithdrawSection from "@/pages/me/ui/WithdrawSection";
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
 * - 모바일은 하늘빛 배경 위 카드(main) 본문 첫 줄에 제목, 섹션 사이 띠, 맨 아래 회원 탈퇴 영역 출력
 * - 데스크톱은 하늘빛 배경 위 폭 480 열에 제목, 카드 두 개, 회원 탈퇴 영역 출력
 */
export default function MePage({ session }: MePageProps) {
	const style = meStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={paths.me}
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
							<Box {...style.mobileDivider} />
							<PolicySection layout="mobile" />
							<Box {...style.mobileSpacer} />
							<WithdrawSection layout="mobile" />
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
								<PolicySection layout="desktop" />
								<WithdrawSection layout="desktop" />
							</VStack>
						</VStack>
					}
				/>
			</VStack>
		</>
	);
}

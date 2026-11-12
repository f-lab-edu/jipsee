import { VStack } from "@seed-design/react";
import { loginStyles } from "@/pages/login/config/loginStyles";
import LoginIntro from "@/pages/login/ui/LoginIntro";
import LoginNotice from "@/pages/login/ui/LoginNotice";
import LoginProviders from "@/pages/login/ui/LoginProviders";
import { colors } from "@/shared/config/colors";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface LoginPageProps {
	next: Nullable<string>;
	hasError: boolean;
}

const mobileTitleId = "login-title-mobile";
const desktopTitleId = "login-title-desktop";

/**
 * 로그인 > 페이지
 *
 * - 계정 링크 없는 로고 헤더 출력
 * - 모바일은 하늘빛 배경 위 카드(main) 본문, 데스크톱은 하늘빛 배경 위 카드에 로고 묶음, 제공자 버튼, 동의와 고지 문구 출력
 *
 * @param next 로그인 뒤 돌아갈 경로. 제공자 버튼에 넘김
 * @param hasError 로그인 실패 안내 출력 여부
 */
export default function LoginPage({ next, hasError }: LoginPageProps) {
	const style = loginStyles;

	return (
		<>
			<Header
				session={null}
				mobileBackground={colors.pageBackground}
				mobileBack={<HeaderBackButton />}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<ResponsiveLayout
					testId="login-body"
					fillsHeight
					mobile={
						<VStack {...style.mobileBody}>
							<LoginIntro titleId={mobileTitleId} />
							<LoginProviders next={next} hasError={hasError} />
							<LoginNotice />
						</VStack>
					}
					desktop={
						<VStack {...style.desktopBody}>
							<VStack
								as="section"
								aria-labelledby={desktopTitleId}
								data-area="login-card"
								{...style.card}
							>
								<LoginIntro titleId={desktopTitleId} />
								<LoginProviders next={next} hasError={hasError} />
								<LoginNotice />
							</VStack>
						</VStack>
					}
				/>
			</VStack>
		</>
	);
}

import { Text, VStack } from "@seed-design/react";
import { loginCopy } from "@/pages/login/config/loginCopy";
import { loginStyles } from "@/pages/login/config/loginStyles";
import { siteMetadata } from "@/shared/config/siteMetadata";
import LogoSymbol from "@/widgets/header/ui/LogoSymbol";

interface LoginIntroProps {
	titleId: string;
}

/**
 * 로그인 > 로고 묶음
 *
 * - 로고 심볼, 서비스 이름 제목, 안내 문구 순서로 출력
 *
 * @param titleId 제목의 id. 모바일과 데스크톱이 함께 렌더링되므로 레이아웃마다 다르게 넘김
 */
export default function LoginIntro({ titleId }: LoginIntroProps) {
	const style = loginStyles;

	return (
		<VStack {...style.intro}>
			<LogoSymbol size={style.logoSize} />
			<Text as="h1" id={titleId} {...style.title}>
				{siteMetadata.name}
			</Text>
			<Text as="p" {...style.description}>
				{loginCopy.description}
			</Text>
		</VStack>
	);
}

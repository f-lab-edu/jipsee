import { Box, Text } from "@seed-design/react";
import type { Provider } from "@/entities/session/model/session";
import ProviderIcon from "@/entities/session/ui/ProviderIcon";
import { loginButtonStyles } from "@/features/login/config/loginButtonStyles";
import { loginProviders } from "@/features/login/config/loginProviders";
import { toAuthorizationHref } from "@/features/login/lib/toAuthorizationHref";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface ProviderLoginButtonProps {
	provider: Provider;
	next: Nullable<string>;
}

/**
 * 로그인 > 제공자 버튼
 *
 * - OAuth 시작 경로로 이동하는 링크 출력
 * - 백엔드 경로라 Next 링크를 쓰지 않음
 *
 * @param next 로그인 뒤 돌아갈 경로. 있으면 시작 경로에 붙임
 */
export default function ProviderLoginButton({
	provider,
	next,
}: ProviderLoginButtonProps) {
	const style = loginButtonStyles;

	return (
		<Box asChild {...style.button[provider]}>
			<a href={toAuthorizationHref(provider, next)}>
				<Box {...style.iconBox}>
					<ProviderIcon provider={provider} size={style.iconSize[provider]} />
				</Box>
				<Text {...style.label[provider]}>{loginProviders[provider].label}</Text>
			</a>
		</Box>
	);
}

import { VStack } from "@seed-design/react";
import ProviderLoginButton from "@/features/login/ui/ProviderLoginButton";
import { loginProviderOrder } from "@/pages/login/config/loginProviderOrder";
import { loginStyles } from "@/pages/login/config/loginStyles";
import LoginErrorNotice from "@/pages/login/ui/LoginErrorNotice";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface LoginProvidersProps {
	next: Nullable<string>;
	hasError: boolean;
}

/**
 * 로그인 > 제공자 버튼 묶음
 *
 * - 로그인 실패 시 버튼 위에 실패 안내 출력
 * - 구글, 카카오, 네이버 순서로 출력
 */
export default function LoginProviders({
	next,
	hasError,
}: LoginProvidersProps) {
	const style = loginStyles;

	return (
		<VStack {...style.actions}>
			{hasError && <LoginErrorNotice />}
			<VStack {...style.providers}>
				{loginProviderOrder.map((provider) => (
					<ProviderLoginButton key={provider} provider={provider} next={next} />
				))}
			</VStack>
		</VStack>
	);
}

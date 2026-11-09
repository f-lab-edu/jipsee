import { VStack } from "@seed-design/react";
import ProviderLoginButton from "@/features/login/ui/ProviderLoginButton";
import { loginProviderOrder } from "@/pages/login/config/loginProviderOrder";
import { loginStyles } from "@/pages/login/config/loginStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface LoginProvidersProps {
	next: Nullable<string>;
}

/**
 * 로그인 > 제공자 버튼 묶음
 *
 * - 구글, 카카오, 네이버 순서로 출력
 */
export default function LoginProviders({ next }: LoginProvidersProps) {
	const style = loginStyles;

	return (
		<VStack {...style.providers}>
			{loginProviderOrder.map((provider) => (
				<ProviderLoginButton key={provider} provider={provider} next={next} />
			))}
		</VStack>
	);
}

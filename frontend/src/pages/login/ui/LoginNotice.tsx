import { Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { loginCopy } from "@/pages/login/config/loginCopy";
import { loginStyles } from "@/pages/login/config/loginStyles";
import { paths } from "@/shared/routes/paths";

/**
 * 로그인 > 동의 문구
 *
 * - 이용약관과 개인정보처리방침은 정책 화면 링크로 출력
 */
export default function LoginNotice() {
	const style = loginStyles.notice;

	return (
		<VStack {...style.group}>
			<Text as="p" {...style.consent}>
				{loginCopy.consentPrefix}
				<Link href={paths.terms}>
					<Text {...style.link}>{loginCopy.terms}</Text>
				</Link>
				{loginCopy.consentMiddle}
				<Link href={paths.privacy}>
					<Text {...style.link}>{loginCopy.privacy}</Text>
				</Link>
				{loginCopy.consentSuffix}
			</Text>
		</VStack>
	);
}

import { Text, VStack } from "@seed-design/react";
import Link from "next/link";
import { loginCopy } from "@/pages/login/config/loginCopy";
import { loginStyles } from "@/pages/login/config/loginStyles";
import LoginNoticeLine from "@/pages/login/ui/LoginNoticeLine";
import { paths } from "@/shared/routes/paths";

/**
 * 로그인 > 동의와 고지 문구
 *
 * - 동의 문구의 이용약관과 개인정보처리방침은 정책 화면 링크로 출력
 * - 고지 두 줄은 정보 아이콘과 함께 출력
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
			{loginCopy.notices.map((text) => (
				<LoginNoticeLine key={text} text={text} />
			))}
		</VStack>
	);
}

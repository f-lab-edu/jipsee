import { HStack, Icon, Text } from "@seed-design/react";
import { loginStyles } from "@/pages/login/config/loginStyles";
import LoginInfoIcon from "@/pages/login/ui/LoginInfoIcon";

interface LoginNoticeLineProps {
	text: string;
}

/** 로그인 > 고지 한 줄 */
export default function LoginNoticeLine({ text }: LoginNoticeLineProps) {
	const style = loginStyles.notice;

	return (
		<HStack {...style.line}>
			<Icon svg={<LoginInfoIcon />} {...style.icon} />
			<Text as="p" {...style.text}>
				{text}
			</Text>
		</HStack>
	);
}

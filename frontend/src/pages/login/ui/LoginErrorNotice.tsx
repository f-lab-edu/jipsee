import IconExclamationmarkCircleLine from "@karrotmarket/react-monochrome-icon/IconExclamationmarkCircleLine";
import { Box, HStack, Icon, Text } from "@seed-design/react";
import { loginCopy } from "@/pages/login/config/loginCopy";
import { loginStyles } from "@/pages/login/config/loginStyles";

/** 로그인 > 실패 안내 */
export default function LoginErrorNotice() {
	const style = loginStyles.errorNotice;

	return (
		<HStack role="alert" {...style.box}>
			<Box {...style.iconCell}>
				<Icon svg={<IconExclamationmarkCircleLine />} {...style.icon} />
			</Box>
			<Text as="p" {...style.text}>
				{loginCopy.error}
			</Text>
		</HStack>
	);
}

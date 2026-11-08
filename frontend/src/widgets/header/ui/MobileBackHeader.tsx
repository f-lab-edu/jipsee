import { HStack, Icon, Text } from "@seed-design/react";
import BackButton from "@/shared/ui/BackButton";
import { mobileBackHeaderStyles } from "@/widgets/header/config/mobileBackHeaderStyles";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

interface MobileBackHeaderProps {
	title: string;
}

/**
 * 헤더 > 모바일 뒤로 가기 레이아웃
 *
 * - 왼쪽에 이전 화면으로 가는 뒤로 가기 버튼 출력
 * - 오른쪽에 한 줄 말줄임 제목 출력
 */
export default function MobileBackHeader({ title }: MobileBackHeaderProps) {
	const style = mobileBackHeaderStyles;

	return (
		<HStack {...style.row}>
			<BackButton style={style.backButton}>
				<Icon svg={<HeaderBackIcon />} {...style.backIcon} />
			</BackButton>
			<Text as="h1" {...style.title}>
				{title}
			</Text>
		</HStack>
	);
}

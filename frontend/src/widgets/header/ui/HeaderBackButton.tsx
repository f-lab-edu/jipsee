import { Icon } from "@seed-design/react";
import BackButton from "@/shared/ui/BackButton";
import { headerBackStyles } from "@/widgets/header/config/headerBackStyles";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

/** 헤더 > 이전 화면으로 가는 뒤로 가기 버튼 */
export default function HeaderBackButton() {
	const style = headerBackStyles;

	return (
		<BackButton style={style.box}>
			<Icon svg={<HeaderBackIcon />} {...style.icon} />
		</BackButton>
	);
}

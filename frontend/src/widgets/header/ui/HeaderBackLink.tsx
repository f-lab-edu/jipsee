import { Box, Icon } from "@seed-design/react";
import Link from "next/link";
import { backButtonCopy } from "@/shared/config/backButtonCopy";
import { paths } from "@/shared/routes/paths";
import { headerBackStyles } from "@/widgets/header/config/headerBackStyles";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

/** 헤더 > 홈으로 가는 뒤로 가기 링크 */
export default function HeaderBackLink() {
	const style = headerBackStyles;

	return (
		<Box asChild {...style.box}>
			<Link href={paths.home} aria-label={backButtonCopy.label}>
				<Icon svg={<HeaderBackIcon />} {...style.icon} />
			</Link>
		</Box>
	);
}

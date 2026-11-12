import { Box } from "@seed-design/react";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import { footerRootStyles } from "@/widgets/footer/config/footerRootStyles";
import DesktopFooter from "@/widgets/footer/ui/DesktopFooter";
import MobileFooter from "@/widgets/footer/ui/MobileFooter";

/**
 * 푸터
 *
 * - 모바일과 데스크톱 레이아웃을 함께 렌더링
 * - 1280 미만에서는 하단 내비게이션 바로 위에 고정(sticky)
 */
export default function Footer() {
	return (
		<Box as="footer" {...footerRootStyles.root}>
			<ResponsiveLayout
				testId="footer"
				mobile={<MobileFooter />}
				desktop={<DesktopFooter />}
			/>
		</Box>
	);
}

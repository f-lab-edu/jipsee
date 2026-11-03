import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import DesktopFooter from "@/widgets/footer/ui/DesktopFooter";
import MobileFooter from "@/widgets/footer/ui/MobileFooter";

/**
 * 푸터
 *
 * - 모바일과 데스크톱 레이아웃을 함께 렌더링
 */
export default function Footer() {
	return (
		<footer>
			<ResponsiveLayout
				testId="footer"
				mobile={<MobileFooter />}
				desktop={<DesktopFooter />}
			/>
		</footer>
	);
}

import DesktopFooter from "@/widgets/footer/ui/DesktopFooter";
import MobileFooter from "@/widgets/footer/ui/MobileFooter";

/** 푸터 링크 목록을 모바일 복사본과 데스크톱 복사본으로 표시함 */
export default function Footer() {
	return (
		<footer>
			<MobileFooter />
			<DesktopFooter />
		</footer>
	);
}

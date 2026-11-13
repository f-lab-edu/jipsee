import type { FooterRootStyle } from "@/widgets/footer/model/footerRootStyle";

// 1280 미만에서만 하단 내비게이션 바로 위에 고정함. Seed position이 반응형 값을 받지 않아 CSS 클래스로 처리함
export const footerRootStyles: FooterRootStyle = {
	root: { className: "footer-docked" },
};

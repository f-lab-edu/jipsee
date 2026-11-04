import type { SVGProps } from "react";

/** 검색 > 홈으로 링크 왼쪽 화살표 아이콘 */
export default function HomeBackLinkIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M19 12H5" />
			<path d="M11 6l-6 6 6 6" />
		</svg>
	);
}

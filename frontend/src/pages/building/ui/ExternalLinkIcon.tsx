import type { SVGProps } from "react";

/** 건물 상세 > 외부 링크 화살표 아이콘 */
export default function ExternalLinkIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M14 4h6v6" />
			<path d="M20 4l-9 9" />
			<path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
		</svg>
	);
}

import type { SVGProps } from "react";

/** 더 보기 > 불러오는 중 회전 아이콘 */
export default function LoadMoreSpinnerIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.4"
			strokeLinecap="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 3a9 9 0 1 0 9 9" opacity="0.9" />
		</svg>
	);
}

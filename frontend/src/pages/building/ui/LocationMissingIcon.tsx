import type { SVGProps } from "react";

/** 건물 상세 > 위치 정보 없음 아이콘 */
export default function LocationMissingIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
			<path d="M4 4l16 16" />
		</svg>
	);
}

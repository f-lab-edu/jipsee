interface LogoSymbolProps {
	size: number;
}

/**
 * 헤더 > 로고 심볼
 *
 * @param size 가로와 세로 픽셀 크기
 */
export default function LogoSymbol({ size }: LogoSymbolProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
			<rect
				width="40"
				height="40"
				rx="11"
				fill="var(--seed-color-bg-brand-solid)"
			/>
			<path
				d="M9 19.5L20 10l11 9.5"
				fill="none"
				stroke="var(--seed-color-palette-static-white)"
				strokeWidth="3.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<rect
				x="13.5"
				y="21"
				width="5.5"
				height="5.5"
				rx="1.2"
				fill="var(--seed-color-palette-static-white)"
			/>
			<rect
				x="21"
				y="21"
				width="5.5"
				height="5.5"
				rx="1.2"
				fill="var(--seed-color-palette-static-white)"
			/>
			<rect
				x="13.5"
				y="28"
				width="5.5"
				height="5.5"
				rx="1.2"
				fill="var(--seed-color-palette-static-white)"
			/>
			<rect
				x="21"
				y="28"
				width="5.5"
				height="5.5"
				rx="1.2"
				fill="var(--seed-color-palette-static-white)"
			/>
		</svg>
	);
}

import { Fragment } from "react";

interface StatusTitleLinesProps {
	lines: readonly string[];
}

/**
 * 공통 > 상태 제목 줄
 *
 * - 줄 사이에 줄바꿈을 넣고, 글자만 읽으면 한 문장이 되도록 줄 끝에 공백 배치
 */
export default function StatusTitleLines({ lines }: StatusTitleLinesProps) {
	return lines.map((line, index) => (
		<Fragment key={line}>
			{line}
			{index < lines.length - 1 && (
				<>
					{" "}
					<br />
				</>
			)}
		</Fragment>
	));
}

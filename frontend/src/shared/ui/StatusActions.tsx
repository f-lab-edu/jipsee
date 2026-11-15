import { VStack } from "@seed-design/react";
import type { StatusKind } from "@/shared/model/statusKind";
import type { StatusStyle } from "@/shared/model/statusStyle";
import RetryButton from "@/shared/ui/RetryButton";
import StatusHomeLink from "@/shared/ui/StatusHomeLink";

interface StatusActionsProps {
	kind: StatusKind;
	style: StatusStyle;
	reset?: () => void;
}

/**
 * 공통 > 상태 화면 버튼 묶음
 *
 * - 404는 홈으로 가기만 주 버튼으로 출력
 * - 오류와 요청 제한은 다시 시도를 주 버튼, 홈으로 가기를 보조 버튼으로 출력
 */
export default function StatusActions({
	kind,
	style,
	reset,
}: StatusActionsProps) {
	if (kind === "notFound") {
		return (
			<VStack {...style.actions}>
				<StatusHomeLink
					style={style.primaryButton}
					textStyle={style.primaryText}
				/>
			</VStack>
		);
	}

	return (
		<VStack {...style.actions}>
			<RetryButton
				style={style.primaryButton}
				textStyle={style.primaryText}
				reset={reset}
			/>
			<StatusHomeLink
				style={style.secondaryButton}
				textStyle={style.secondaryText}
			/>
		</VStack>
	);
}

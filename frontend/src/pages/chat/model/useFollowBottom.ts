"use client";

import { useCallback, useEffect, useRef } from "react";

const bottomThreshold = 40;

/**
 * 채팅 > 맨 아래 따라가기
 *
 * - 화면이 맨 아래에 있을 때만 변경 키가 바뀔 때마다 맨 아래로 내림
 * - 처음 그릴 때는 따라가는 상태로 시작함
 * - 사용자가 위로 올렸으면 따라가지 않음
 * - 반환한 함수를 부르면 다음 변경부터 다시 따라감
 *
 * @param changeKey 대화 내용이 바뀌면 달라지는 값
 */
export function useFollowBottom(changeKey: string) {
	const isAtBottomRef = useRef(true);

	const followBottom = useCallback(() => {
		isAtBottomRef.current = true;
	}, []);

	useEffect(() => {
		const update = () => {
			const distance =
				document.documentElement.scrollHeight -
				(window.scrollY + window.innerHeight);
			isAtBottomRef.current = distance <= bottomThreshold;
		};

		window.addEventListener("scroll", update, { passive: true });

		return () => window.removeEventListener("scroll", update);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 변경 키가 바뀔 때만 실행함
	useEffect(() => {
		if (isAtBottomRef.current) {
			window.scrollTo({ top: document.documentElement.scrollHeight });
		}
	}, [changeKey]);

	return followBottom;
}

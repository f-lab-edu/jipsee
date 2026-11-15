"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { newChatContext } from "@/pages/chat/model/newChatContext";

interface ChatNewChatProviderProps {
	children: ReactNode;
}

/**
 * 채팅 > 새 대화 신호 제공자
 *
 * - 새 대화 링크를 누를 때마다 신호 횟수를 올림
 * - 대화 본문은 이 횟수를 key로 써 같은 주소에서도 새로 시작함
 */
export default function ChatNewChatProvider({
	children,
}: ChatNewChatProviderProps) {
	const [newChatCount, setNewChatCount] = useState(0);
	const startNewChat = useCallback(
		() => setNewChatCount((count) => count + 1),
		[],
	);
	const value = useMemo(
		() => ({ newChatCount, startNewChat }),
		[newChatCount, startNewChat],
	);

	return (
		<newChatContext.Provider value={value}>{children}</newChatContext.Provider>
	);
}

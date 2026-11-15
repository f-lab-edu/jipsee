"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useNewChat } from "@/pages/chat/model/useNewChat";
import { paths } from "@/shared/routes/paths";

type ChatNewChatLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/**
 * 채팅 > 새 대화 링크
 *
 * - /chat으로 이동하는 링크
 * - 누르면 진행 중인 대화를 버리고 새 대화로 시작하도록 신호를 보냄
 */
export default function ChatNewChatLink({
	onClick,
	...props
}: ChatNewChatLinkProps) {
	const { startNewChat } = useNewChat();

	return (
		<Link
			href={paths.chat}
			onClick={(event) => {
				onClick?.(event);
				startNewChat();
			}}
			{...props}
		/>
	);
}

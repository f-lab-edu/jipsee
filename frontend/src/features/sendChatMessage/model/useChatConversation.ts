"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { streamChatAnswer } from "@/entities/chat/api/streamChatAnswer";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatConversationState } from "@/features/sendChatMessage/model/chatConversationState";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

interface UseChatConversationOptions {
	chatId: Nullable<number>;
	buildingId: Nullable<number>;
	initialMessages: ChatMessage[];
	isLimitReached: boolean;
	firstQuestion: Nullable<string>;
}

/**
 * 채팅 > 대화 상태
 *
 * - 질문을 보내면 사용자 말풍선을 붙이고 waiting, 첫 글자가 오면 streaming, 끝나면 idle로 바꿈
 * - 첫 질문이 있으면 처음 그릴 때 바로 보냄
 * - 새 대화의 스트림이 끝나면 /chat/{id}로 바꿈
 * - CHAT_DAILY_LIMIT이면 방금 붙인 질문 말풍선을 지우고 limit으로 바꿈
 * - TOO_MANY_REQUESTS, SERVER_ERROR, 스트림 중간 끊김, 연결 실패이면 받은 글자를 지우고 error로 바꿈
 * - UNAUTHORIZED이면 돌아올 경로를 담아 로그인으로 이동
 * - 취소하면 질문을 보내기 전 상태로 되돌림
 * - 다시 시도는 실패한 질문 말풍선을 지우고 같은 질문을 새 요청으로 보냄
 *
 * @param firstQuestion 처음 그릴 때 바로 보낼 질문
 */
export function useChatConversation({
	chatId,
	buildingId,
	initialMessages,
	isLimitReached,
	firstQuestion,
}: UseChatConversationOptions) {
	const router = useRouter();
	const [state, setState] = useState<ChatConversationState>({
		chatId,
		messages: initialMessages,
		draft: "",
		phase: isLimitReached ? "limit" : "idle",
		errorCode: null,
	});
	const stateRef = useRef(state);
	const abortRef = useRef<Nullable<AbortController>>(null);
	const localIdRef = useRef(0);
	stateRef.current = state;

	const start = useCallback(
		async (baseMessages: ChatMessage[], question: string) => {
			const controller = new AbortController();
			abortRef.current = controller;
			localIdRef.current -= 1;
			const userMessage: ChatMessage = {
				id: localIdRef.current,
				role: "USER",
				content: question,
				sources: [],
				buildings: [],
				createdAt: new Date().toISOString(),
			};
			const isNewChat = stateRef.current.chatId === null;
			let createdChatId: Nullable<number> = null;
			let isDone = false;

			setState((previous) => ({
				...previous,
				messages: [...baseMessages, userMessage],
				draft: "",
				phase: "waiting",
				errorCode: null,
			}));

			const fail = (code: "TOO_MANY_REQUESTS" | "SERVER_ERROR") =>
				setState((previous) => ({
					...previous,
					draft: "",
					phase: "error",
					errorCode: code,
				}));

			try {
				for await (const event of streamChatAnswer(
					{
						chatId: stateRef.current.chatId,
						buildingId,
						content: question,
					},
					controller.signal,
				)) {
					if (event.type === "chat") {
						createdChatId = event.chatId;
						setState((previous) => ({ ...previous, chatId: event.chatId }));
					}

					if (event.type === "delta") {
						setState((previous) => ({
							...previous,
							draft: previous.draft + event.text,
							phase: "streaming",
						}));
					}

					if (event.type === "done") {
						isDone = true;
						setState((previous) => ({
							...previous,
							messages: [...previous.messages, event.message],
							draft: "",
							phase: "idle",
						}));

						if (isNewChat && createdChatId !== null) {
							router.replace(paths.chatDetail(createdChatId), {
								scroll: false,
							});
						}
					}

					if (event.type === "error") {
						if (event.code === "CHAT_DAILY_LIMIT") {
							setState((previous) => ({
								...previous,
								messages: baseMessages,
								draft: "",
								phase: "limit",
							}));
						}

						if (event.code === "UNAUTHORIZED") {
							router.push(
								paths.loginWithNext(
									`${window.location.pathname}${window.location.search}`,
								),
							);
						}

						if (
							event.code === "TOO_MANY_REQUESTS" ||
							event.code === "SERVER_ERROR"
						) {
							fail(event.code);
						}

						return;
					}
				}

				if (!isDone) {
					fail("SERVER_ERROR");
				}
			} catch {
				if (controller.signal.aborted) {
					setState((previous) => ({
						...previous,
						messages: baseMessages,
						draft: "",
						phase: "idle",
					}));
					return;
				}

				fail("SERVER_ERROR");
			}
		},
		[buildingId, router],
	);

	const startRef = useRef(start);
	startRef.current = start;

	const send = useCallback(
		(question: string) => {
			const { phase, messages } = stateRef.current;

			if (phase === "waiting" || phase === "streaming" || phase === "limit") {
				return;
			}

			start(messages, question);
		},
		[start],
	);

	const retry = useCallback(() => {
		const { phase, messages } = stateRef.current;
		const failedQuestion = messages.at(-1);

		if (phase !== "error" || failedQuestion?.role !== "USER") {
			return;
		}

		start(messages.slice(0, -1), failedQuestion.content);
	}, [start]);

	useEffect(() => {
		if (firstQuestion !== null) {
			startRef.current(stateRef.current.messages, firstQuestion);
		}

		return () => abortRef.current?.abort();
	}, [firstQuestion]);

	return { ...state, send, retry };
}

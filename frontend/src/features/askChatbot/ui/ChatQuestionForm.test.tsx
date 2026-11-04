import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { takePendingQuestion } from "@/features/askChatbot/model/takePendingQuestion";
import ChatQuestionForm from "@/features/askChatbot/ui/ChatQuestionForm";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("ChatQuestionForm", () => {
	beforeEach(() => {
		push.mockClear();
		takePendingQuestion();
	});

	it("공백만 입력하고 제출하면 이동하지 않고 질문을 보관하지 않음", () => {
		render(<ChatQuestionForm variant="expandedPanel" />);

		fireEvent.change(screen.getByLabelText("집사에게 질문"), {
			target: { value: "   " },
		});
		fireEvent.click(screen.getByRole("button", { name: "보내기" }));

		expect(push).not.toHaveBeenCalled();
		expect(takePendingQuestion()).toBeNull();
	});

	it("값을 입력하고 제출하면 앞뒤 공백을 지운 질문을 보관하고 /chat으로 이동함", () => {
		render(<ChatQuestionForm variant="expandedPanel" />);

		fireEvent.change(screen.getByLabelText("집사에게 질문"), {
			target: { value: "  망원동 전세 시세 알려줘  " },
		});
		fireEvent.click(screen.getByRole("button", { name: "보내기" }));

		expect(push).toHaveBeenCalledWith("/chat");
		expect(takePendingQuestion()).toBe("망원동 전세 시세 알려줘");
	});
});

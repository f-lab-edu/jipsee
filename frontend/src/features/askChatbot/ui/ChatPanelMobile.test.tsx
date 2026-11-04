import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChatPanelMobile from "@/features/askChatbot/ui/ChatPanelMobile";

describe.each(["expanded", "compact"] as const)(
	"ChatPanelMobile %s",
	(layout) => {
		it("세션이 없으면 /login으로 가는 로그인하고 이용하기 링크를 표시함", () => {
			render(<ChatPanelMobile session={null} layout={layout} />);

			expect(
				screen.getByRole("link", { name: "로그인하고 이용하기" }),
			).toHaveProperty("pathname", "/login");
		});

		it("세션이 있으면 로그인하고 이용하기 링크를 표시하지 않음", () => {
			render(
				<ChatPanelMobile session={{ provider: "GOOGLE" }} layout={layout} />,
			);

			expect(screen.queryByText("로그인하고 이용하기")).toBeNull();
		});
	},
);

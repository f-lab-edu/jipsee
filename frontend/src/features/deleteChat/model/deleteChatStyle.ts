import type { BoxProps, TextProps } from "@seed-design/react";
import type { DeleteChatVariant } from "@/features/deleteChat/model/deleteChatVariant";

export interface DeleteChatStyle {
	trigger: Record<DeleteChatVariant, BoxProps>;
	triggerText: TextProps;
}

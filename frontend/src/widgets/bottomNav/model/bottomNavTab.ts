export type BottomNavTabId = "home" | "chat" | "me";

export interface BottomNavTab {
	id: BottomNavTabId;
	label: string;
	path: string;
	loggedOutPath?: string;
	relatedPaths: readonly string[];
	relatedPrefixes: readonly string[];
}

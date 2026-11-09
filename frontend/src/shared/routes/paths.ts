export const paths = {
	home: "/",
	search: "/search",
	login: "/login",
	loginWithNext: (next: string) => `/login?next=${encodeURIComponent(next)}`,
	oauthAuthorization: (segment: string) => `/oauth2/authorization/${segment}`,
	chat: "/chat",
	chatWithBuilding: (id: number) => `/chat?buildingId=${id}`,
	me: "/me",
	dataSources: "/policies/data-sources",
	terms: "/policies/terms",
	privacy: "/policies/privacy",
	building: (id: number) => `/buildings/${id}`,
} as const;

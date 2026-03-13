"use client";

import { createContext, useContext } from "react";

export type AuthContextType = {
	userId: string | null;
	name: string | null;
	email: string | null;
};

export const AuthContext = createContext<AuthContextType | undefined>({
	userId: null,
	name: null,
	email: null,
});

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};

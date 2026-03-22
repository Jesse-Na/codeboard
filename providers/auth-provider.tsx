"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { PropsWithChildren, useState, useEffect } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
	const debugMode = process.env.DEBUG_MODE === "true";
	const [userId, setUserId] = useState<string | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);

	useEffect(() => {
		if (debugMode) {
			console.warn(
				"DEBUG_MODE is enabled. Using mock authentication data. This should not be used in production.",
			);

			setUserId("test-user-id");
			setName("Test User");
			setEmail("test@example.com");
		}
	}, [debugMode]);

	return (
		<AuthContext.Provider value={{ userId, name, email }}>
			{children}
		</AuthContext.Provider>
	);
}

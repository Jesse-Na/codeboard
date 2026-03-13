import { AuthContext } from "@/contexts/AuthContext";
import { PropsWithChildren } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
	return (
		<AuthContext.Provider
			value={{
				userId: "test-user-id",
				name: "Test User",
				email: "test@example.com",
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

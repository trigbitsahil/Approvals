import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAvatar } from "@/stores/AvatarStore";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User2 } from "lucide-react";
import { i18n } from "@lingui/core";
import { useAuth } from "@/contexts/AuthContext";

export const UserMenu = () => {
  const { avatarUrl } = useAvatar();
  const navigate = useNavigate();
  const { logout, clearAuthState } = useAuth();

  const handleLogout = () => {
    // Clear authentication state and tokens
    logout(); // Clears tokens and session data
    clearAuthState(); // Ensures all auth-related state is reset

    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Reset any ongoing API calls (basic approach)
    window.fetch = new Proxy(window.fetch, {
      apply: function (target, thisArg, argumentsList) {
        return Promise.reject(new Error("Fetch aborted due to logout"));
      },
    });

    // Force a full page reload to reset the app state
    window.location.href = "/"; // Using window.location.href instead of navigate for a hard reload
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-8 w-8 rounded-full object-cover cursor-pointer"
          />
        ) : (
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground flex items-center justify-center">
              <User2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>
          {i18n.t({ id: "ui.My Account", message: "My Account" })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          {i18n.t({ id: "ui.Logout", message: "Logout" })}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

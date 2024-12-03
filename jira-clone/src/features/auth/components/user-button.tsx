"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {DottedSeparator} from "@/components/dotted-separator";
import {Loader} from "lucide-react";

import {useLogout} from "../api/use-logout";
import {useCurrent} from "../api/use-current"

export const UserButton = () => {
    const {data: user, isLoading} = useCurrent();
    if (isLoading) {
        return (
            <div
                className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
                <Loader className="size-4 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    if (!user) {
        return null;
    }
    const {name, email} = user;
    const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase() ?? "U";

    return (
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                {avatarFallback}
            </AvatarFallback>
        </Avatar>
    );
};


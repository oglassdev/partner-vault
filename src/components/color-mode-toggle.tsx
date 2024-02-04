import { As, useColorMode } from "@kobalte/core"

import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import {BiRegularLaptop, BiRegularMoon, BiRegularSun} from "solid-icons/bi";

export default function ColorModeToggle() {
    const { setColorMode } = useColorMode()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <As component={Button} variant="ghost" size="sm" class="w-9 px-0">
                    <BiRegularSun class="rotate-0 scale-150 transition-all dark:-rotate-90 dark:scale-0" />
                    <BiRegularMoon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-150" />
                    <span class="sr-only">Toggle theme</span>
                </As>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setColorMode("light")}>
                    <BiRegularSun class="mr-2 h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColorMode("dark")}>
                    <BiRegularMoon class="mr-2 h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setColorMode("system")}>
                    <BiRegularLaptop class="mr-2 h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
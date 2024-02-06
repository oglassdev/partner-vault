import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog.tsx";
import { As } from "@kobalte/core";
import { Button } from "~/components/ui/button.tsx";
import { BiRegularHelpCircle } from "solid-icons/bi";
import { ParentProps } from "solid-js";

export default function Help(props: ParentProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<As component={Button} variant="ghost" size="sm" class="w-9 px-0">
					<BiRegularHelpCircle class="rotate-0 scale-150 transition-all" />
					<span class="sr-only">Help</span>
				</As>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogTitle>Help</AlertDialogTitle>
				<AlertDialogDescription>{props.children}</AlertDialogDescription>
			</AlertDialogContent>
		</AlertDialog>
	);
}

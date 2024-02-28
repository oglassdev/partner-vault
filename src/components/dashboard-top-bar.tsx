import { A, useLocation, useRouteData } from "@solidjs/router";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { For, ParentProps, createSignal } from "solid-js";
import { Select } from "~/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import LogoutButton from "./logout-button";
import ColorModeToggle from "./color-mode-toggle";
import { TeamDataType } from "~/lib/team-data";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-solid";
import Help from "./dialog/help";

export default function DashboardTopBar(props: ParentProps) {
  return (
    <div class="border-muted flex w-full flex-row items-center gap-2 border-b p-2">
      {props.children}
      <span class="pl-2 font-semibold">Partner Vault</span>
      <span class="mx-auto" />
      <Help></Help>
    </div>
  );
}

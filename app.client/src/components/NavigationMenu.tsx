"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  CircleCheckIcon,
  CircleHelpIcon,
  CircleIcon,
} from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ModeToggle from "./ModeToggle";
// import { LanguageDialog } from "./LanguageToggle";
// import ColorThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";
import { Trans } from "@lingui/react";
import { i18n } from "@lingui/core";
import InstallButton from "./InstallButton";

export const NavigationMenuBar = () => {
  return (
    <div className="w-full border-b bg-background relative z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              {/* <NavigationMenuTrigger> */}
              {/* <Trans id="ui.Home" /> */}
              {/* </NavigationMenuTrigger> */}
              {/* <NavigationMenuContent>
                <ul className="grid gap-1 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium">
                          <Trans id="ui.shadcn/ui" />
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          <Trans id="ui.Beautifully designed components built with Tailwind CSS" />
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem to="/docs" title={i18n.t({ id: "ui.Introduction" })}>
                    <Trans id="ui.Reusable components built using Radix UI and Tailwind CSS." />
                  </ListItem>
                  <ListItem
                    to="/docs/installation"
                    title={i18n.t({ id: "ui.Installation" })}
                  >
                    <Trans id="ui.How to install dependencies and structure your app." />
                  </ListItem>
                  <ListItem
                    to="/docs/primitives/typography"
                    title={i18n.t({ id: "ui.Typography" })}
                  >
                    <Trans id="ui.Styles for headings, paragraphs, lists...etc." />
                  </ListItem>
                </ul>
              </NavigationMenuContent> */}
            </NavigationMenuItem>

            <NavigationMenuItem>
              {/* <NavigationMenuTrigger> */}
              {/* <Trans id="ui.Components" /> */}
              {/* </NavigationMenuTrigger> */}
              {/* <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem key={component.to} title={component.title} to={component.to}>
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent> */}
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/docs">{/* <Trans id="ui.Docs" /> */}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              {/* <NavigationMenuTrigger> */}
              {/* <Trans id="ui.Simple" /> */}
              {/* </NavigationMenuTrigger> */}
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="#">
                        <Trans id="ui.Components" />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#">
                        <Trans id="ui.Documentation" />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#">
                        <Trans id="ui.Blocks" />
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              {/* <NavigationMenuTrigger> */}
              {/* <Trans id="ui.With Icon" /> */}
              {/* </NavigationMenuTrigger> */}
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="#" className="flex items-center gap-2">
                        <CircleHelpIcon className="w-4 h-4" />
                        <Trans id="ui.Backlog" />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#" className="flex items-center gap-2">
                        <CircleIcon className="w-4 h-4" />
                        <Trans id="ui.To Do" />
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="#" className="flex items-center gap-2">
                        <CircleCheckIcon className="w-4 h-4" />
                        <Trans id="ui.Done" />
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <ModeToggle />
          {/* <ColorThemeSwitcher /> */}
          {/* <LanguageDialog /> */}
          <InstallButton />
          <UserMenu />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/">
                    <Trans id="ui.Home" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Trans id="ui.Components" />
                  </DropdownMenuSubTrigger>
                  {/* <DropdownMenuSubContent>
                    {components.map((component) => (
                      <DropdownMenuItem key={component.to} asChild>
                        <Link to={component.to}>{component.title}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent> */}
                </DropdownMenuSub>
                <DropdownMenuItem asChild>
                  <Link to="/docs">
                    <Trans id="ui.Docs" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Trans id="ui.Simple" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild>
                      <Link to="#">
                        <Trans id="ui.Components" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="#">
                        <Trans id="ui.Documentation" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="#">
                        <Trans id="ui.Blocks" />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Trans id="ui.With Icon" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem asChild>
                      <Link to="#" className="flex items-center gap-2">
                        <CircleHelpIcon className="h-4 w-4" />
                        <Trans id="ui.Backlog" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="#" className="flex items-center gap-2">
                        <CircleIcon className="h-4 w-4" />
                        <Trans id="ui.To Do" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="#" className="flex items-center gap-2">
                        <CircleCheckIcon className="h-4 w-4" />
                        <Trans id="ui.Done" />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListItem = ({
  title,
  children,
  to,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) => {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={to} className="block space-y-1">
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default NavigationMenuBar;

import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const token = data.session.access_token;
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join("")
        );
        const parsedJwt = JSON.parse(jsonPayload);

        const { data: user, error } = await supabase
          .from("users")
          .select("avatar_url")
          .eq("id", parsedJwt.sub)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error.message);
        } else {
          setAvatarUrl(user?.avatar_url || null);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={() => setCollapsed(false)} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {/* Home */}
            <Tooltip
              content="Dashboard Overview"
              placement="bottom-end"
              delay={2000}
              offset={-7}
              className="bg-transparent text-white text-sm"
            >
              <div>
                <SidebarItem
                  title="Home"
                  icon={<HomeIcon />}
                  isActive={pathname === "/"}
                  href="/"
                />
              </div>
            </Tooltip>

            {/* Main Menu */}
            <SidebarMenu title="Main Menu">
              <Tooltip
                content="Marketing tools to acquire customers"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/growth"}
                    title="Growth 💵"
                    icon={<AccountsIcon />}
                    href="/account/growth"
                  />
                </div>
              </Tooltip>

              <Tooltip
                content="Manage subscriptions and customers"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/acquisition"}
                    title="Acquisition 🏃"
                    icon={<CustomersIcon />}
                    href="/account/acquisition"
                  />
                </div>
              </Tooltip>

              <Tooltip
                content="Track rank progress and rewards"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/rank"}
                    title="Rank 🏆"
                    icon={<ProductsIcon />}
                    href="/account/rank"
                  />
                </div>
              </Tooltip>

              <Tooltip
                content="View revenue and payouts"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/earnings"}
                    title="Earnings"
                    icon={<PaymentsIcon />}
                    href="/account/earnings"
                  />
                </div>
              </Tooltip>

              <Tooltip
                content="Access help center and community"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/resources"}
                    title="Resources"
                    icon={<ReportsIcon />}
                    href="/account/resources"
                  />
                </div>
              </Tooltip>
            </SidebarMenu>

            {/* General */}
            <SidebarMenu title="General">
              <Tooltip
                content="Developer tools and documentation"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/developers"}
                    title="Developers"
                    icon={<DevIcon />}
                    href="/account/developers"
                  />
                </div>
              </Tooltip>

              <Tooltip
                content="Customize website and app branding"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/branding"}
                    title="Branding"
                    icon={<ViewIcon />}
                    href="/account/branding"
                  />
                </div>
              </Tooltip>

              <Tooltip
                content="Manage account and preferences"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/settings"}
                    title="Settings"
                    icon={<SettingsIcon />}
                    href="/account/settings"
                  />
                </div>
              </Tooltip>
            </SidebarMenu>

            {/* Updates */}
            <SidebarMenu title="Updates">
              <Tooltip
                content="Latest changes and updates"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/account/changelog"}
                    title="Changelog"
                    icon={<ChangeLogIcon />}
                    href="/account/changelog"
                  />
                </div>
              </Tooltip>
            </SidebarMenu>
          </div>

          {/* Footer */}
          <div className={Sidebar.Footer()}>
            <Tooltip
              content="Settings"
              placement="top-end"
              delay={2000}
              offset={-7}
              className="bg-transparent text-white text-sm"
            >
              <SidebarItem
                icon={<SettingsIcon />}
                isActive={pathname === "/account/settings"}
                href="/account/settings"
                title={""}
              />
            </Tooltip>
            <Tooltip
              content="Adjustments"
              placement="top-end"
              delay={2000}
              offset={-7}
              className="bg-transparent text-white text-sm"
            >
              <SidebarItem
                icon={<BalanceIcon />}
                isActive={pathname === "/account/adjustments"}
                href="/account/adjustments"
                title={""}
              />
            </Tooltip>
            <Tooltip
              content="Profile"
              placement="top-end"
              delay={2000}
              offset={-7}
              className="bg-transparent text-white text-sm"
            >
              <SidebarItem
                icon={
                  <Avatar
                    src={avatarUrl || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                    size="sm"
                  />
                }
                isActive={pathname === "/account/profile"}
                href="/account/profile"
                title={""}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};

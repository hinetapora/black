import React from "react";
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

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

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
              {/* Growth */}
              <Tooltip
                content="Marketing tools to acquire customers"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/growth"}
                    title="Growth 💵"
                    icon={<AccountsIcon />}
                    href="/dashboard/growth"
                  />
                </div>
              </Tooltip>

              {/* Acquisition */}
              <Tooltip
                content="Manage subscriptions and customers"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/acquisition"}
                    title="Acquisition 🏃"
                    icon={<CustomersIcon />}
                    href="/dashboard/acquisition"
                  />
                </div>
              </Tooltip>

              {/* Rank */}
              <Tooltip
                content="Track rank progress and rewards"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/rank"}
                    title="Rank 🏆"
                    icon={<ProductsIcon />}
                    href="/dashboard/rank"
                  />
                </div>
              </Tooltip>

              {/* Earnings */}
              <Tooltip
                content="View revenue and payouts"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/earnings"}
                    title="Earnings"
                    icon={<PaymentsIcon />}
                    href="/dashboard/earnings"
                  />
                </div>
              </Tooltip>

              {/* Resources */}
              <Tooltip
                content="Access help center and community"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/resources"}
                    title="Resources"
                    icon={<ReportsIcon />}
                    href="/dashboard/resources"
                  />
                </div>
              </Tooltip>
            </SidebarMenu>

            {/* General */}
            <SidebarMenu title="General">
              {/* Developers */}
              <Tooltip
                content="Developer tools and documentation"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/developers"}
                    title="Developers"
                    icon={<DevIcon />}
                    href="/dashboard/developers"
                  />
                </div>
              </Tooltip>

              {/* Branding */}
              <Tooltip
                content="Customize website and app branding"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/branding"}
                    title="Branding"
                    icon={<ViewIcon />}
                    href="/dashboard/branding"
                  />
                </div>
              </Tooltip>

              {/* Settings */}
              <Tooltip
                content="Manage account and preferences"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/settings"}
                    title="Settings"
                    icon={<SettingsIcon />}
                    href="/dashboard/settings"
                  />
                </div>
              </Tooltip>
            </SidebarMenu>

            {/* Updates */}
            <SidebarMenu title="Updates">
              {/* Changelog */}
              <Tooltip
                content="Latest changes and updates"
                placement="bottom-end"
                delay={2000}
                offset={-7}
                className="bg-transparent text-white text-sm"
              >
                <div>
                  <SidebarItem
                    isActive={pathname === "/dashboard/changelog"}
                    title="Changelog"
                    icon={<ChangeLogIcon />}
                    href="/dashboard/changelog"
                  />
                </div>
              </Tooltip>
            </SidebarMenu>
          </div>

          {/* Footer */}
          <div className={Sidebar.Footer()}>
            <Tooltip
              content="Settings"
              placement="bottom-end"
              delay={2000}
              offset={-7}
              className="bg-transparent text-white text-sm"
            >
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip
              content="Adjustments"
              placement="bottom-end"
              delay={2000}
              offset={-7}
              className="bg-transparent text-white text-sm"
            >
              <div className="max-w-fit">
                <BalanceIcon />
              </div>
            </Tooltip>
            <Tooltip
              content="Profile"
              placement="bottom-end"
              delay={2000}
              offset={-7}
              className="bg-transparent text-white text-sm"
            >
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};

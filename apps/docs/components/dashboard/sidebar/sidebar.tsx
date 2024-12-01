// components/dashboard/sidebar/SidebarWrapper.tsx

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
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
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
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
            />

            {/* Main Menu */}
            <SidebarMenu title="Main Menu">
              {/* Accounts */}
              <SidebarItem
                isActive={pathname === "/dashboard/accounts"}
                title="Accounts"
                icon={<AccountsIcon />}
                href="/dashboard/accounts" // Absolute path
              />

              {/* Payments */}
              <SidebarItem
                isActive={pathname === "/dashboard/payments"}
                title="Payments"
                icon={<PaymentsIcon />}
                href="/dashboard/payments" // Absolute path
              />

              {/* Balances - Dropdown */}
              <CollapseItems
  icon={<BalanceIcon />}
  items={["Banks Accounts", "Credit Cards", "Loans"]}
  title="Balances"
/>

              {/* Customers */}
              <SidebarItem
                isActive={pathname === "/dashboard/customers"}
                title="Customers"
                icon={<CustomersIcon />}
                href="/dashboard/customers" // Absolute path
              />

              {/* Products */}
              <SidebarItem
                isActive={pathname === "/dashboard/products"}
                title="Products"
                icon={<ProductsIcon />}
                href="/dashboard/products" // Absolute path
              />

              {/* Reports */}
              <SidebarItem
                isActive={pathname === "/dashboard/reports"}
                title="Reports"
                icon={<ReportsIcon />}
                href="/dashboard/reports" // Absolute path
              />
            </SidebarMenu>

            {/* General */}
            <SidebarMenu title="General">
              {/* Developers */}
              <SidebarItem
                isActive={pathname === "/dashboard/developers"}
                title="Developers"
                icon={<DevIcon />}
                href="/dashboard/developers" // Absolute path
              />

              {/* View Test Data */}
              <SidebarItem
                isActive={pathname === "/dashboard/view"}
                title="View Test Data"
                icon={<ViewIcon />}
                href="/dashboard/view" // Absolute path
              />

              {/* Settings */}
              <SidebarItem
                isActive={pathname === "/dashboard/settings"}
                title="Settings"
                icon={<SettingsIcon />}
                href="/dashboard/settings" // Absolute path
              />
            </SidebarMenu>

            {/* Updates */}
            <SidebarMenu title="Updates">
              {/* Changelog */}
              <SidebarItem
                isActive={pathname === "/dashboard/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
                href="/dashboard/changelog" // Absolute path
              />
            </SidebarMenu>
          </div>

          {/* Footer */}
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
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
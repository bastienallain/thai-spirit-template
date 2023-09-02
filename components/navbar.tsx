"use client";
import React, { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import { allPosts } from "contentlayer/generated";

export const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const validPosts = allPosts.filter(
    (post) => post && post.catMenu && post.catCity && post.category
  );
  console.log("allPosts après le filtrage : ", validPosts);

  const filteredPosts = validPosts.filter(
    (post) => post?.language === "fr" && post?.title?.includes(searchTerm)
  );

  console.log("filteredPosts : ", filteredPosts);

  const menuData = validPosts.reduce<Record<string, Record<string, string[]>>>(
    (acc, post) => {
      const { catMenu, catCity, category } = post;
      console.log(
        `catMenu: ${catMenu}, catCity: ${catCity}, category: ${category}`
      );

      if (catMenu && catCity && category) {
        if (!acc[catMenu]) {
          acc[catMenu] = {};
        }
        if (!acc[catMenu][catCity]) {
          acc[catMenu][catCity] = [];
        }
        if (!acc[catMenu][catCity].includes(category)) {
          acc[catMenu][catCity].push(category);
        }
      }
      return acc;
    },
    {} as Record<string, Record<string, string[]>>
  );

  console.log("menuData : ", menuData);

  const searchInput = (
    <Input
      aria-label="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {Object.keys(menuData).map((menu) => (
            <Dropdown key={menu}>
              <NavbarItem>
                <DropdownTrigger>
                  <Button>{menu}</Button>
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu>
                {Object.keys(menuData[menu]).map((city) => (
                  <Dropdown key={city}>
                    <DropdownTrigger>
                      <Button>{city}</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      {menuData[menu][city].map((category) => (
                        <DropdownItem key={category}>{category}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                ))}
              </DropdownMenu>
            </Dropdown>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter} aria-label="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.discord} aria-label="Discord">
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} aria-label="Github">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="Github">
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};

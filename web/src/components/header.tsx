'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  AtSign,
  Bell,
  Check,
  ChevronRight,
  KeyRound,
  LogOut,
  Moon,
  Search,
  SearchIcon,
  Sun,
  SunMoon,
  UserCog,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Control, Input } from './ui/input';

export const Header = () => {
  const [searchBar, setSearchBar] = useState(false);

  const { user, removeUserAndToken } = useAuth();
  const { theme, setTheme } = useTheme();

  const controlRef = useRef<HTMLInputElement>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setParams = (query: string) => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set('search', query);
    } else params.delete('search');

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setParams(query);
  }, 750);

  const handleSignOut = async () => {
    await removeUserAndToken();
    toast.info('Você saiu da sua conta!');
  };

  useEffect(() => {
    if (searchBar && controlRef.current) {
      controlRef.current.focus();
    }
  }, [searchBar]);

  return (
    <header
      className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-3 data-[searchbar=open]:block"
      data-searchbar={searchBar ? 'open' : 'closed'}
    >
      <Link
        href="/"
        className="font-alt text-primary hover:text-primary/90 text-4xl font-bold outline-none transition-all focus-visible:underline data-[searchbar=open]:hidden tracking-wider"
        title="Página inicial"
        data-searchbar={searchBar ? 'open' : 'closed'}
      >
        ACSoon
      </Link>

      <Input
        variant="search"
        name="search"
        className="hidden data-[searchbar=open]:flex data-[searchbar=open]:bg-transparent data-[searchbar=open]:ring-0 data-[searchbar=open]:hover:bg-transparent sm:flex sm:w-72 mx-3"
        data-searchbar={searchBar ? 'open' : 'closed'}
      >
        <Search className="group-focus-within:text-primary ml-2.5 size-5 text-gray-400 transition-all" />

        <Control
          ref={controlRef}
          type="search"
          name="search"
          id="search"
          autoComplete="off"
          title="Digite para pesquisar"
          onChange={handleSearch}
          onBlur={() => setSearchBar(false)}
          defaultValue={searchParams.get('search')?.toString()}
          placeholder="Pesquisar..."
          className="mr-0.5"
        />
      </Input>

      <div
        className="flex gap-2 data-[searchbar=open]:hidden"
        data-searchbar={searchBar ? 'open' : 'closed'}
      >
        <Button
          variant="toggle"
          size="toggle"
          title="Pesquisar"
          onClick={() => setSearchBar(true)}
          className="sm:hidden"
        >
          <SearchIcon className="text-foreground transition-all" />
        </Button>

        <Button
          variant="toggle"
          size="toggle"
          title="Notificações"
          className="data-[state=open]:bg-primary/20"
        >
          <Bell className="text-foreground data-[state=open]:text-primary transition-all" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger title="Sua conta">
            <Image
              src={'/no-profile.jpg'}
              alt="No profile"
              width={40}
              height={40}
              className="overflow-hidden rounded-full"
              priority
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            sideOffset={5}
            className="mr-5 min-w-48 data-[state=closed]:animate-[menu-hide_200ms] data-[state=open]:animate-[menu-show_200ms]"
          >
            <h1 className="px-1.5 py-0.5 font-semibold">
              Olá, {user?.name?.split(' ')[0]}!
            </h1>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <div className="flex items-center gap-2">
                  {theme === 'light' ? (
                    <Sun className="size-5" />
                  ) : theme === 'dark' ? (
                    <Moon className="size-5" />
                  ) : (
                    <SunMoon className="size-5" />
                  )}
                  Aparência
                </div>
                <ChevronRight className="size-5" />
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent className="mr-1 min-w-48 data-[state=closed]:animate-[submenu-hide_200ms] data-[state=open]:animate-[submenu-show_200ms]">
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="system">
                    <DropdownMenuItemIndicator>
                      <Check className="size-5" />
                    </DropdownMenuItemIndicator>
                    Automático
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="dark">
                    <DropdownMenuItemIndicator>
                      <Check className="size-5" />
                    </DropdownMenuItemIndicator>
                    Tema escuro
                  </DropdownMenuRadioItem>

                  <DropdownMenuRadioItem value="light">
                    <DropdownMenuItemIndicator>
                      <Check className="size-5" />
                    </DropdownMenuItemIndicator>
                    Tema claro
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="#">
                <UserCog className="size-5" />
                Editar perfil
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="#">
                <AtSign className="size-5" />
                Alterar email
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="#">
                <KeyRound className="size-5" />
                Alterar senha
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-500" onSelect={handleSignOut}>
              <LogOut className="size-5" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

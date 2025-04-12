
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {PlusCircle} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Image
            src="https://picsum.photos/50/50"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Home</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Recipes</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="secondary">
            <PlusCircle className="mr-2" />
            Add Recipe
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 p-4">
        <h1>Welcome to Recipe Vault</h1>
        <p>Your place to store and manage your favorite recipes.</p>
      </div>
    </SidebarProvider>
  );
}


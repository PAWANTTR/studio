'use client'

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter // Import DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeImageUrl, setNewRecipeImageUrl] = useState('');

  const handleAddRecipe = () => {
    if (newRecipeName && newRecipeImageUrl) {
      const newRecipe: Recipe = {
        id: uuidv4(),
        name: newRecipeName,
        imageUrl: newRecipeImageUrl,
      };
      setRecipes([...recipes, newRecipe]);
      setNewRecipeName('');
      setNewRecipeImageUrl('');
      setOpen(false);
    }
  };

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <PlusCircle className="mr-2" />
                Add Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Recipe</DialogTitle>
                <DialogDescription>
                  Create a new recipe by entering the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Recipe Name
                  </Label>
                  <Input
                    id="name"
                    value={newRecipeName}
                    onChange={(e) => setNewRecipeName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    value={newRecipeImageUrl}
                    onChange={(e) => setNewRecipeImageUrl(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              {/* @ts-expect-error */}
              <DialogFooter>
                <Button type="submit" onClick={handleAddRecipe}>
                  Add Recipe
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Welcome to Recipe Vault</h1>
        <p className="text-muted-foreground">Your place to store and manage your favorite recipes.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  width={300}
                  height={200}
                  className="rounded-md object-cover aspect-video"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarProvider>
  );
}

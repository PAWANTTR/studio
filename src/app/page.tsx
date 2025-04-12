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
import {PlusCircle, Edit, Trash2, X} from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"


interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  ingredients: string;
  instructions: string;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeImage, setNewRecipeImage] = useState<File | null>(null);
    const [newRecipeIngredients, setNewRecipeIngredients] = useState('');
    const [newRecipeInstructions, setNewRecipeInstructions] = useState('');
  const { toast } = useToast()
  const [editRecipeId, setEditRecipeId] = useState<string | null>(null);
  const [openImage, setOpenImage] = useState<string | null>(null);



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewRecipeImage(e.target.files[0]);
    }
  };

  const handleAddRecipe = async () => {
    if (newRecipeName && newRecipeImage && newRecipeIngredients && newRecipeInstructions) {
       // Generate a temporary URL for the local image file
       const imageUrl = URL.createObjectURL(newRecipeImage);

      const newRecipe: Recipe = {
        id: uuidv4(),
        name: newRecipeName,
        imageUrl: imageUrl,
        ingredients: newRecipeIngredients,
        instructions: newRecipeInstructions,
      };
      setRecipes([...recipes, newRecipe]);
      setNewRecipeName('');
      setNewRecipeImage(null);
        setNewRecipeIngredients('');
        setNewRecipeInstructions('');
      setOpen(false);
      toast({
        title: "Recipe added!",
        description: "Your recipe has been added to the vault.",
      })
    } else {
      toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please enter all the recipe details.',
          })
    }
  };

  const handleEditRecipe = (recipeId: string) => {
    setEditRecipeId(recipeId);
    const recipeToEdit = recipes.find((recipe) => recipe.id === recipeId);
    if (recipeToEdit) {
      setNewRecipeName(recipeToEdit.name);
      setNewRecipeIngredients(recipeToEdit.ingredients);
      setNewRecipeInstructions(recipeToEdit.instructions);
      // For image, you might need to handle differently if you're allowing image edits
      setOpen(true);
    }
  };

  const handleUpdateRecipe = () => {
    if (editRecipeId && newRecipeName && newRecipeIngredients && newRecipeInstructions) {
      const updatedRecipes = recipes.map((recipe) => {
        if (recipe.id === editRecipeId) {
          return {
            ...recipe,
            name: newRecipeName,
            ingredients: newRecipeIngredients,
            instructions: newRecipeInstructions,
          };
        }
        return recipe;
      });
      setRecipes(updatedRecipes);
      setNewRecipeName('');
        setNewRecipeIngredients('');
        setNewRecipeInstructions('');
      setNewRecipeImage(null);
      setOpen(false);
      setEditRecipeId(null);
      toast({
        title: "Recipe updated!",
        description: "Your recipe has been updated.",
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter all recipe details.',
      });
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
    setRecipes(updatedRecipes);
    toast({
      title: "Recipe deleted!",
      description: "Your recipe has been deleted.",
    });
  };

    const handleImageClick = (imageUrl: string) => {
        setOpenImage(imageUrl);
    };

    const handleCloseImage = () => {
        setOpenImage(null);
    };

   // Load recipes from local storage on component mount
    useEffect(() => {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
            setRecipes(JSON.parse(storedRecipes));
        }
    }, []);

    // Save recipes to local storage whenever the recipes state changes
    useEffect(() => {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }, [recipes]);


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
                <DialogTitle>{editRecipeId ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
                <DialogDescription>
                  {editRecipeId ? "Update the recipe details below." : "Create a new recipe by entering the details below."}
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
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="col-span-3"
                  />
                </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ingredients" className="text-right">
                          Ingredients
                      </Label>
                      <Textarea
                          id="ingredients"
                          value={newRecipeIngredients}
                          onChange={(e) => setNewRecipeIngredients(e.target.value)}
                          className="col-span-3"
                      />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="instructions" className="text-right">
                          Instructions
                      </Label>
                      <Textarea
                          id="instructions"
                          value={newRecipeInstructions}
                          onChange={(e) => setNewRecipeInstructions(e.target.value)}
                          className="col-span-3"
                      />
                  </div>
              </div>
              {/* @ts-expect-error */}
              <DialogFooter>
                <Button type="submit" onClick={editRecipeId ? handleUpdateRecipe : handleAddRecipe}>
                  {editRecipeId ? "Update Recipe" : "Add Recipe"}
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
                      className="rounded-md object-cover aspect-video cursor-pointer"
                      onClick={() => handleImageClick(recipe.imageUrl)}
                      unoptimized={true}
                  />
                <p className="text-sm text-muted-foreground mt-2">
                  Ingredients: {recipe.ingredients}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Instructions: {recipe.instructions}
                </p>
              </CardContent>
                <div className="flex justify-between p-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditRecipe(recipe.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteRecipe(recipe.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
            </Card>
          ))}
        </div>
          {openImage && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex justify-center items-center">
                  <div className="relative">
                      <Image
                          src={openImage}
                          alt="Full Size Recipe"
                          width={800}
                          height={600}
                          className="rounded-md object-contain"
                          unoptimized={true}
                      />
                      <Button
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={handleCloseImage}
                      >
                          <X className="h-6 w-6"/>
                      </Button>
                  </div>
              </div>
          )}
      </div>
    </SidebarProvider>
  );
}

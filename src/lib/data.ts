import { createClient } from "@/lib/supabase/server";
import type { Category, Item } from "@/types/database";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function getCategory(id: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
}

export async function getItemsByCategory(categoryId: string): Promise<Item[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }

  return data || [];
}

export async function getItem(categoryId: string, slug: string): Promise<Item | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("category_id", categoryId)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching item:", error);
    return null;
  }

  return data;
}

export async function getAdjacentItems(
  categoryId: string,
  sortOrder: number
): Promise<{ prev: Item | null; next: Item | null }> {
  const supabase = await createClient();

  const { data: prev } = await supabase
    .from("items")
    .select("*")
    .eq("category_id", categoryId)
    .lt("sort_order", sortOrder)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: next } = await supabase
    .from("items")
    .select("*")
    .eq("category_id", categoryId)
    .gt("sort_order", sortOrder)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  return { prev: prev, next: next };
}

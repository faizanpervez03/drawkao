"use client";

import { createClient } from "@/lib/supabase/client";
import type { Category, Item } from "@/types/database";

const supabase = createClient();

export async function fetchCategories(): Promise<Category[]> {
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

export async function fetchItemsByCategory(categoryId: string): Promise<Item[]> {
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

export async function fetchItem(categoryId: string, slug: string): Promise<Item | null> {
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

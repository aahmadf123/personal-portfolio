import { createServerSupabaseClient } from "./supabase";
import type {
  Experience,
  Education,
  Certification,
  Achievement,
} from "../types/timeline";

export async function getAllExperience(): Promise<Experience[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching experience entries:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllExperience:", error);
    return [];
  }
}

export async function getFeaturedExperience(): Promise<Experience[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("is_featured", true)
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching featured experience:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFeaturedExperience:", error);
    return [];
  }
}

export async function getAllEducation(): Promise<Education[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching education entries:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllEducation:", error);
    return [];
  }
}

export async function getAllCertifications(): Promise<Certification[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("issue_date", { ascending: false });

    if (error) {
      console.error("Error fetching certifications:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllCertifications:", error);
    return [];
  }
}

export async function getAllAchievements(): Promise<Achievement[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("award_date", { ascending: false });

    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllAchievements:", error);
    return [];
  }
}

export async function getFeaturedAchievements(): Promise<Achievement[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_featured", true)
      .order("award_date", { ascending: false });

    if (error) {
      console.error("Error fetching featured achievements:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFeaturedAchievements:", error);
    return [];
  }
}

export async function getAchievementById(
  id: number
): Promise<Achievement | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching achievement with id ${id}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error in getAchievementById for id ${id}:`, error);
    return null;
  }
}

export async function createAchievement(
  achievementData: Partial<Achievement>
): Promise<Achievement | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("achievements")
      .insert([achievementData])
      .select()
      .single();

    if (error) {
      console.error("Error creating achievement:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in createAchievement:", error);
    return null;
  }
}

export async function updateAchievement(
  id: number,
  achievementData: Partial<Achievement>
): Promise<Achievement | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("achievements")
      .update(achievementData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating achievement with id ${id}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error in updateAchievement for id ${id}:`, error);
    return null;
  }
}

export async function deleteAchievement(id: number): Promise<boolean> {
  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting achievement with id ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteAchievement for id ${id}:`, error);
    return false;
  }
}

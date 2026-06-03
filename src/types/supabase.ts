export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      staff: {
        Row: {
          id: string;
          store_id: string;
          user_id: string | null;
          name: string;
          avatar_url: string | null;
          role: "staff" | "admin";
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          user_id?: string | null;
          name: string;
          avatar_url?: string | null;
          role?: "staff" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          user_id?: string | null;
          name?: string;
          avatar_url?: string | null;
          role?: "staff" | "admin";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: {
          id: string;
          label: string;
          category: "customer" | "peer";
          emoji: string;
        };
        Insert: {
          id?: string;
          label: string;
          category: "customer" | "peer";
          emoji: string;
        };
        Update: {
          id?: string;
          label?: string;
          category?: "customer" | "peer";
          emoji?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          store_id: string;
          staff_id: string;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          staff_id: string;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          staff_id?: string;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          }
        ];
      };
      review_tags: {
        Row: {
          id: string;
          review_id: string;
          tag_id: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          tag_id: string;
        };
        Update: {
          id?: string;
          review_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "review_tags_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      thanks: {
        Row: {
          id: string;
          store_id: string;
          from_staff_id: string;
          to_staff_id: string;
          tag_id: string | null;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          from_staff_id: string;
          to_staff_id: string;
          tag_id?: string | null;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          from_staff_id?: string;
          to_staff_id?: string;
          tag_id?: string | null;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thanks_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thanks_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thanks_from_staff_id_fkey";
            columns: ["from_staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thanks_to_staff_id_fkey";
            columns: ["to_staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}

// 便利な型エイリアス
export type Store = Database["public"]["Tables"]["stores"]["Row"];
export type Staff = Database["public"]["Tables"]["staff"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewTag = Database["public"]["Tables"]["review_tags"]["Row"];
export type Thanks = Database["public"]["Tables"]["thanks"]["Row"];

// ジョイン済み複合型（UI コンポーネント・クエリで使用）
export type ReviewWithTags = Review & {
  tags: Tag[];
};

export type ThanksWithStaff = Thanks & {
  from_staff: Pick<Staff, "id" | "name" | "avatar_url">;
  to_staff: Pick<Staff, "id" | "name" | "avatar_url">;
  tag: Tag | null;
};

export type TagCount = {
  tag: Tag;
  count: number;
};

export type StaffWithScore = Staff & {
  review_tag_count: number;
  thanks_received_count: number;
};

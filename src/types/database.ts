
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          category_id: string | null;
          featured: boolean;
          active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          category_id?: string | null;
          featured?: boolean;
          active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number | null;
          category_id?: string | null;
          featured?: boolean;
          active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      bulk_upload_sessions: {
        Row: {
          id: string;
          session_name: string;
          category_id: string;
          default_price_text: string;
          total_images: number;
          processed_images: number;
          status: string;
          created_by: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          session_name: string;
          category_id: string;
          default_price_text?: string;
          total_images?: number;
          processed_images?: number;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          session_name?: string;
          category_id?: string;
          default_price_text?: string;
          total_images?: number;
          processed_images?: number;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      bulk_upload_images: {
        Row: {
          id: string;
          session_id: string;
          image_url: string;
          product_name: string | null;
          processed: boolean;
          product_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          image_url: string;
          product_name?: string | null;
          processed?: boolean;
          product_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          image_url?: string;
          product_name?: string | null;
          processed?: boolean;
          product_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

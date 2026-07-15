// AUTO-GENERATED from supabase/migrations/*.sql — do not hand-edit.
// Regenerate: apply migrations to a real Postgres instance and introspect
// information_schema (see scripts used in the Step 7 commit description),
// or run `supabase gen types typescript` once Docker is available.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          id: string
          user_id: string
          type: Database["public"]["Enums"]["address_type"]
          full_name: string
          phone: string
          line1: string
          line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          landmark: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: Database["public"]["Enums"]["address_type"]
          full_name: string
          phone: string
          line1: string
          line2?: string | null
          city: string
          state: string
          postal_code: string
          country?: string
          landmark?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: Database["public"]["Enums"]["address_type"]
          full_name?: string
          phone?: string
          line1?: string
          line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          landmark?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      affiliate_referrals: {
        Row: {
          id: string
          affiliate_id: string
          order_id: string
          commission_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          affiliate_id: string
          order_id: string
          commission_amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          affiliate_id?: string
          order_id?: string
          commission_amount?: number
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          id: string
          user_id: string
          code: string
          status: Database["public"]["Enums"]["affiliate_status"]
          commission_rate: number
          total_earnings: number
          total_paid: number
          payout_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          status?: Database["public"]["Enums"]["affiliate_status"]
          commission_rate?: number
          total_earnings?: number
          total_paid?: number
          payout_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          status?: Database["public"]["Enums"]["affiliate_status"]
          commission_rate?: number
          total_earnings?: number
          total_paid?: number
          payout_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      attribute_values: {
        Row: {
          id: string
          attribute_id: string
          value: string
          display_value: string
          hex_color: string | null
        }
        Insert: {
          id?: string
          attribute_id: string
          value: string
          display_value: string
          hex_color?: string | null
        }
        Update: {
          id?: string
          attribute_id?: string
          value?: string
          display_value?: string
          hex_color?: string | null
        }
        Relationships: []
      }
      attributes: {
        Row: {
          id: string
          name: string
          display_name: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          actor_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          actor_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          author_id: string | null
          category_id: string | null
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image_url: string | null
          status: Database["public"]["Enums"]["content_status"]
          tags: string[]
          meta_title: string | null
          meta_description: string | null
          view_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id?: string | null
          category_id?: string | null
          title: string
          slug: string
          excerpt?: string | null
          content: string
          cover_image_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          meta_title?: string | null
          meta_description?: string | null
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string | null
          category_id?: string | null
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          cover_image_url?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          meta_title?: string | null
          meta_description?: string | null
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          banner_url: string | null
          website_url: string | null
          is_active: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          website_url?: string | null
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          website_url?: string | null
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          variant_id: string
          quantity: number
          saved_for_later: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          variant_id: string
          quantity: number
          saved_for_later?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          variant_id?: string
          quantity?: number
          saved_for_later?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          parent_id: string | null
          name: string
          slug: string
          description: string | null
          image_url: string | null
          icon: string | null
          is_active: boolean
          display_order: number
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          icon?: string | null
          is_active?: boolean
          display_order?: number
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          icon?: string | null
          is_active?: boolean
          display_order?: number
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_pages: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          status: Database["public"]["Enums"]["content_status"]
          meta_title: string | null
          meta_description: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          status?: Database["public"]["Enums"]["content_status"]
          meta_title?: string | null
          meta_description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          status?: Database["public"]["Enums"]["content_status"]
          meta_title?: string | null
          meta_description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      compare_items: {
        Row: {
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          id: string
          coupon_id: string
          user_id: string
          order_id: string | null
          discount_amount: number
          redeemed_at: string
        }
        Insert: {
          id?: string
          coupon_id: string
          user_id: string
          order_id?: string | null
          discount_amount: number
          redeemed_at?: string
        }
        Update: {
          id?: string
          coupon_id?: string
          user_id?: string
          order_id?: string | null
          discount_amount?: number
          redeemed_at?: string
        }
        Relationships: []
      }
      coupon_scope_targets: {
        Row: {
          coupon_id: string
          target_type: string
          target_id: string
        }
        Insert: {
          coupon_id: string
          target_type: string
          target_id: string
        }
        Update: {
          coupon_id?: string
          target_type?: string
          target_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          min_order_value: number
          max_discount_amount: number | null
          usage_limit: number | null
          usage_count: number
          per_user_limit: number
          scope: Database["public"]["Enums"]["coupon_scope"]
          is_active: boolean
          starts_at: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          min_order_value?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          per_user_limit?: number
          scope?: Database["public"]["Enums"]["coupon_scope"]
          is_active?: boolean
          starts_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          min_order_value?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          per_user_limit?: number
          scope?: Database["public"]["Enums"]["coupon_scope"]
          is_active?: boolean
          starts_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          id: string
          key: string
          subject: string
          html_body: string
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          subject: string
          html_body: string
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          subject?: string
          html_body?: string
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      flash_sale_products: {
        Row: {
          flash_sale_id: string
          product_id: string
          sale_price: number
          stock_limit: number | null
          sold_count: number
        }
        Insert: {
          flash_sale_id: string
          product_id: string
          sale_price: number
          stock_limit?: number | null
          sold_count?: number
        }
        Update: {
          flash_sale_id?: string
          product_id?: string
          sale_price?: number
          stock_limit?: number | null
          sold_count?: number
        }
        Relationships: []
      }
      flash_sales: {
        Row: {
          id: string
          name: string
          banner_url: string | null
          starts_at: string
          ends_at: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          banner_url?: string | null
          starts_at: string
          ends_at: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          banner_url?: string | null
          starts_at?: string
          ends_at?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          id: string
          variant_id: string
          change_quantity: number
          reason: string
          reference_type: string | null
          reference_id: string | null
          created_by: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          variant_id: string
          change_quantity: number
          reason: string
          reference_type?: string | null
          reference_id?: string | null
          created_by?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          variant_id?: string
          change_quantity?: number
          reason?: string
          reference_type?: string | null
          reference_id?: string | null
          created_by?: string | null
          note?: string | null
          created_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: Database["public"]["Enums"]["notification_type"]
          title: string
          body: string | null
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: Database["public"]["Enums"]["notification_type"]
          title: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
          title?: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          seller_id: string | null
          product_name: string
          variant_label: string | null
          sku: string
          image_url: string | null
          unit_price: number
          quantity: number
          tax_amount: number
          discount_amount: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          seller_id?: string | null
          product_name: string
          variant_label?: string | null
          sku: string
          image_url?: string | null
          unit_price: number
          quantity: number
          tax_amount?: number
          discount_amount?: number
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          seller_id?: string | null
          product_name?: string
          variant_label?: string | null
          sku?: string
          image_url?: string | null
          unit_price?: number
          quantity?: number
          tax_amount?: number
          discount_amount?: number
          total?: number
          created_at?: string
        }
        Relationships: []
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
          note: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
          note?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          note?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          status: Database["public"]["Enums"]["order_status"]
          currency: string
          subtotal: number
          discount_total: number
          shipping_total: number
          tax_total: number
          grand_total: number
          coupon_id: string | null
          shipping_address: Json
          billing_address: Json
          customer_note: string | null
          estimated_delivery_at: string | null
          placed_at: string
          cancelled_at: string | null
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id: string
          status?: Database["public"]["Enums"]["order_status"]
          currency?: string
          subtotal: number
          discount_total?: number
          shipping_total?: number
          tax_total?: number
          grand_total: number
          coupon_id?: string | null
          shipping_address: Json
          billing_address: Json
          customer_note?: string | null
          estimated_delivery_at?: string | null
          placed_at?: string
          cancelled_at?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          currency?: string
          subtotal?: number
          discount_total?: number
          shipping_total?: number
          tax_total?: number
          grand_total?: number
          coupon_id?: string | null
          shipping_address?: Json
          billing_address?: Json
          customer_note?: string | null
          estimated_delivery_at?: string | null
          placed_at?: string
          cancelled_at?: string | null
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          order_id: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_order_id: string | null
          provider_payment_id: string | null
          provider_signature: string | null
          method: string | null
          amount: number
          currency: string
          status: Database["public"]["Enums"]["payment_status"]
          raw_response: Json | null
          failure_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_order_id?: string | null
          provider_payment_id?: string | null
          provider_signature?: string | null
          method?: string | null
          amount: number
          currency?: string
          status?: Database["public"]["Enums"]["payment_status"]
          raw_response?: Json | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_order_id?: string | null
          provider_payment_id?: string | null
          provider_signature?: string | null
          method?: string | null
          amount?: number
          currency?: string
          status?: Database["public"]["Enums"]["payment_status"]
          raw_response?: Json | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_answers: {
        Row: {
          id: string
          question_id: string
          user_id: string
          answer: string
          is_seller_answer: boolean
          helpful_count: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          user_id: string
          answer: string
          is_seller_answer?: boolean
          helpful_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          user_id?: string
          answer?: string
          is_seller_answer?: boolean
          helpful_count?: number
          created_at?: string
        }
        Relationships: []
      }
      product_media: {
        Row: {
          id: string
          product_id: string
          variant_id: string | null
          url: string
          media_type: string
          alt_text: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_id?: string | null
          url: string
          media_type?: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          variant_id?: string | null
          url?: string
          media_type?: string
          alt_text?: string | null
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
      product_questions: {
        Row: {
          id: string
          product_id: string
          user_id: string
          question: string
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          question: string
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          question?: string
          is_approved?: boolean
          created_at?: string
        }
        Relationships: []
      }
      product_variant_attributes: {
        Row: {
          variant_id: string
          attribute_value_id: string
        }
        Insert: {
          variant_id: string
          attribute_value_id: string
        }
        Update: {
          variant_id?: string
          attribute_value_id?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          barcode: string | null
          price: number
          compare_at_price: number | null
          stock_quantity: number
          low_stock_threshold: number
          weight_grams: number | null
          is_default: boolean
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          barcode?: string | null
          price: number
          compare_at_price?: number | null
          stock_quantity?: number
          low_stock_threshold?: number
          weight_grams?: number | null
          is_default?: boolean
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          barcode?: string | null
          price?: number
          compare_at_price?: number | null
          stock_quantity?: number
          low_stock_threshold?: number
          weight_grams?: number | null
          is_default?: boolean
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          seller_id: string | null
          category_id: string | null
          brand_id: string | null
          name: string
          slug: string
          short_description: string | null
          description: string | null
          status: Database["public"]["Enums"]["product_status"]
          base_price: number
          compare_at_price: number | null
          tax_rate: number
          currency: string
          is_featured: boolean
          is_trending: boolean
          is_best_seller: boolean
          video_url: string | null
          has_360_view: boolean
          avg_rating: number
          review_count: number
          sold_count: number
          view_count: number
          meta_title: string | null
          meta_description: string | null
          tags: string[]
          search_vector: unknown | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id?: string | null
          category_id?: string | null
          brand_id?: string | null
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          base_price: number
          compare_at_price?: number | null
          tax_rate?: number
          currency?: string
          is_featured?: boolean
          is_trending?: boolean
          is_best_seller?: boolean
          video_url?: string | null
          has_360_view?: boolean
          avg_rating?: number
          review_count?: number
          sold_count?: number
          view_count?: number
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          search_vector?: unknown | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string | null
          category_id?: string | null
          brand_id?: string | null
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          base_price?: number
          compare_at_price?: number | null
          tax_rate?: number
          currency?: string
          is_featured?: boolean
          is_trending?: boolean
          is_best_seller?: boolean
          video_url?: string | null
          has_360_view?: boolean
          avg_rating?: number
          review_count?: number
          sold_count?: number
          view_count?: number
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          search_vector?: unknown | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          date_of_birth: string | null
          gender: string | null
          is_phone_verified: boolean
          marketing_opt_in: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          date_of_birth?: string | null
          gender?: string | null
          is_phone_verified?: boolean
          marketing_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          date_of_birth?: string | null
          gender?: string | null
          is_phone_verified?: boolean
          marketing_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          user_id: string
          product_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      returns: {
        Row: {
          id: string
          order_item_id: string
          user_id: string
          reason: string
          comment: string | null
          status: Database["public"]["Enums"]["return_status"]
          refund_amount: number | null
          requested_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          order_item_id: string
          user_id: string
          reason: string
          comment?: string | null
          status?: Database["public"]["Enums"]["return_status"]
          refund_amount?: number | null
          requested_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          order_item_id?: string
          user_id?: string
          reason?: string
          comment?: string | null
          status?: Database["public"]["Enums"]["return_status"]
          refund_amount?: number | null
          requested_at?: string
          resolved_at?: string | null
        }
        Relationships: []
      }
      review_images: {
        Row: {
          id: string
          review_id: string
          url: string
          display_order: number
        }
        Insert: {
          id?: string
          review_id: string
          url: string
          display_order?: number
        }
        Update: {
          id?: string
          review_id?: string
          url?: string
          display_order?: number
        }
        Relationships: []
      }
      review_votes: {
        Row: {
          review_id: string
          user_id: string
          is_helpful: boolean
          created_at: string
        }
        Insert: {
          review_id: string
          user_id: string
          is_helpful: boolean
          created_at?: string
        }
        Update: {
          review_id?: string
          user_id?: string
          is_helpful?: boolean
          created_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_item_id: string | null
          rating: number
          title: string | null
          body: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          helpful_count: number
          ai_summary_included: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          order_item_id?: string | null
          rating: number
          title?: string | null
          body?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          ai_summary_included?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          order_item_id?: string | null
          rating?: number
          title?: string | null
          body?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          ai_summary_included?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sellers: {
        Row: {
          id: string
          user_id: string
          business_name: string
          gstin: string | null
          pan: string | null
          status: Database["public"]["Enums"]["seller_status"]
          commission_rate: number
          support_email: string | null
          support_phone: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_ifsc: string | null
          rejection_reason: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          gstin?: string | null
          pan?: string | null
          status?: Database["public"]["Enums"]["seller_status"]
          commission_rate?: number
          support_email?: string | null
          support_phone?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          rejection_reason?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          gstin?: string | null
          pan?: string | null
          status?: Database["public"]["Enums"]["seller_status"]
          commission_rate?: number
          support_email?: string | null
          support_phone?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_ifsc?: string | null
          rejection_reason?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          id: string
          order_id: string
          carrier: string | null
          tracking_number: string | null
          tracking_url: string | null
          status: string
          shipped_at: string | null
          delivered_at: string | null
          estimated_delivery_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          carrier?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          status?: string
          shipped_at?: string | null
          delivered_at?: string | null
          estimated_delivery_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          carrier?: string | null
          tracking_number?: string | null
          tracking_url?: string | null
          status?: string
          shipped_at?: string | null
          delivered_at?: string | null
          estimated_delivery_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: Json
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          id: string
          ticket_id: string
          sender_id: string
          message: string
          attachment_urls: string[]
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          sender_id: string
          message: string
          attachment_urls?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          sender_id?: string
          message?: string
          attachment_urls?: string[]
          created_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          order_id: string | null
          subject: string
          status: Database["public"]["Enums"]["ticket_status"]
          priority: Database["public"]["Enums"]["ticket_priority"]
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id?: string | null
          subject: string
          status?: Database["public"]["Enums"]["ticket_status"]
          priority?: Database["public"]["Enums"]["ticket_priority"]
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string | null
          subject?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          priority?: Database["public"]["Enums"]["ticket_priority"]
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      address_type: "shipping" | "billing"
      affiliate_status: "pending" | "approved" | "suspended"
      content_status: "draft" | "published" | "archived"
      coupon_scope: "all" | "category" | "product" | "brand"
      discount_type: "percentage" | "fixed"
      notification_type: "order" | "promo" | "system" | "payment" | "support"
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "returned" | "refunded"
      payment_provider: "razorpay" | "stripe" | "cod"
      payment_status: "pending" | "authorized" | "paid" | "failed" | "refunded" | "partially_refunded"
      product_status: "draft" | "active" | "archived"
      return_status: "requested" | "approved" | "rejected" | "picked_up" | "refunded"
      seller_status: "pending" | "approved" | "rejected" | "suspended"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      user_role: "customer" | "seller" | "admin" | "support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];

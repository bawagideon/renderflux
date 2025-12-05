import { SupabaseClient } from '@supabase/supabase-js';

export async function getRecentLogs(supabase: SupabaseClient, limit: number = 5) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching logs:', error);
        return [];
    }

    return data;
}

export async function getUsageStats(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { total_requests: 0, credits_used: 0 };

    // Get start of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count, error } = await supabase
        .from('usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth);

    if (error) {
        console.error('Error fetching usage stats:', error);
        return { total_requests: 0, credits_used: 0 };
    }

    return {
        total_requests: count || 0,
        credits_used: count || 0 // Assuming 1 request = 1 credit for now
    };
}

export async function getUserPlan(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { plan: 'hobby', credits_limit: 50 };

    const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

    if (error) {
        // Default to hobby if no profile or error (user might not be created fully yet)
        return { plan: 'hobby', credits_limit: 50 };
    }

    const plan = data?.plan || 'hobby';
    const limits: Record<string, number> = {
        hobby: 50,
        pro: 5000,
        enterprise: 1000000 // Arbitrary large number
    };

    return {
        plan,
        credits_limit: limits[plan] || 50
    };
}

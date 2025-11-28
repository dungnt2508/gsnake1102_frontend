export interface User {
    id: string;
    email: string;
}

export interface Persona {
    id: string;
    user_id: string;
    language_style: string;
    tone: string;
    topics_interest: string[];
    created_at: string;
    updated_at: string;
}

export interface Article {
    id: string;
    url: string;
    title?: string;
    fetched_at?: string;
    summary?: string;
    source?: string;
    user_id: string;
    workflow_id?: string;
    status: 'pending' | 'processing' | 'done' | 'failed';
}

export interface Schedule {
    id: string;
    user_id: string;
    article_url: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    last_fetched?: string;
    next_fetch: string;
    workflow_id?: string;
}

export interface ToolRequest {
    id: string;
    user_id: string;
    request_payload: Record<string, any>;
    status: 'pending' | 'processing' | 'done' | 'failed';
    result?: Record<string, any>;
    workflow_id?: string;
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

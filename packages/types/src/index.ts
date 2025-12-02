export interface RenderRequest {
    html?: string;
    templateId?: string;
    data?: Record<string, any>;
}

export interface RenderResponse {
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    url?: string;
}

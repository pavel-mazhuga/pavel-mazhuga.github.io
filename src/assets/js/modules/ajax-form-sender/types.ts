export interface IAjaxFormSender {
    // readonly inputSelector: string;
    // send (
    //   submit: HTMLInputElement|null,
    //   inputsToSend: HTMLInputElement[]|null,
    //   targetUrl: string|null
    // ): Promise<ApiResponse<any>|string>
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    html?: string;
}
  
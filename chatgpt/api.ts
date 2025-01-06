import { Message } from "@/models";
import { ChatRequestBody, ChatResponse } from "./model";

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

type RequestParams = {
  url: string;
  method: RequestMethod;
  params?: Record<string, any>;
  body?: Record<string, any>;
};

export const fetchData = async <T>(options: RequestParams): Promise<T> => {
  const { url, method, params, body } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-ms-client-principal-id": "chatbot-demo",
    },
  };

  if (
    method === RequestMethod.POST ||
    method === RequestMethod.DELETE ||
    (method === RequestMethod.PATCH && body)
  ) {
    fetchOptions.body = JSON.stringify(body);
  }

  const fullUrl = params
    ? `${url}?${new URLSearchParams(params).toString()}`
    : url;

  const response = await fetch(fullUrl, fetchOptions);

  if (!response.ok) {
    const errorResponse = await response.json(); // Parse the error response

    throw new Error(
      errorResponse.error_desc ||
        errorResponse.title ||
        "Network response was not ok"
    ); // Use the detail from the error response
  }

  // Check if the response is JSON
  const contentType = response.headers.get("Content-Type");

  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T; // Parse as JSON if the content type is JSON
  } else {
    return (await response.text()) as unknown as T;
  }
};

// TODO: To support session. Need to send history in a session as an array
export const chat = async (
  text: string,
  conversation_id?: string | undefined
) => {
  const request: ChatRequestBody = {
    language: "",
    conversation_id,
    messages: [
      {
        role: "User",
        content: text,
      },
    ],
  };

  console.log("chat: request:", request);
  const content = await fetchData<ChatResponse>({
    url: "https://w71o53mmwf.execute-api.ap-southeast-1.amazonaws.com/v1/generate",
    method: RequestMethod.POST,
    body: request,
  });

  return content;
};

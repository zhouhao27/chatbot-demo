export interface ChatResponse {
  id: string;
  model: string;
  created: string;
  object: string;
  choices: Choice[];
  history_metadata: HistoryMetadata;
  orig_response: OrigResponse;
}

export interface Choice {
  messages: Message[];
}

export interface Message {
  content: string;
  role: string;
}

export interface HistoryMetadata {
  title: string;
  date: string;
  conversation_id: string;
}

export interface OrigResponse {
  ResponseMetadata: ResponseMetadata;
  citations: Citation[];
  output: Output;
  sessionId: string;
}

export interface ResponseMetadata {
  RequestId: string;
  HTTPStatusCode: number;
  HTTPHeaders: Httpheaders;
  RetryAttempts: number;
}

export interface Httpheaders {
  date: string;
  "content-type": string;
  "content-length": string;
  connection: string;
  "x-amzn-requestid": string;
}

export interface Citation {
  generatedResponsePart: GeneratedResponsePart;
  retrievedReferences: RetrievedReference[];
}

export interface GeneratedResponsePart {
  textResponsePart: TextResponsePart;
}

export interface TextResponsePart {
  span: Span;
  text: string;
}

export interface Span {
  end: number;
  start: number;
}

export interface RetrievedReference {
  content: Content;
  location: Location;
  metadata: Metadata;
}

export interface Content {
  text: string;
}

export interface Location {
  s3Location: S3Location;
  type: string;
}

export interface S3Location {
  uri: string;
}

export interface Metadata {
  "x-amz-bedrock-kb-source-uri": string;
  "x-amz-bedrock-kb-document-page-number": number;
  "x-amz-bedrock-kb-chunk-id": string;
  "x-amz-bedrock-kb-data-source-id": string;
}

export interface Output {
  text: string;
}

export interface ChatRequestBody {
  language: string;
  messages: Message[];
  conversation_id?: string;
}

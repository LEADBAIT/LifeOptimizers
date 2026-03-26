import { requireEnv } from "@life-optimizers/config";

const BASE_URL = "https://api.todoist.com/api/v1";

export interface TodoistTask {
  id: string;
  /** The task title. */
  content: string;
  description: string;
  due?: { date: string };
  labels: string[];
}

type TaskUpdate = {
  labels?: string[];
  due_string?: string;
};

function authHeader(): string {
  return `Bearer ${requireEnv("TODOIST_API_KEY")}`;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Todoist API error ${res.status}: ${text}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function getTask(taskId: string): Promise<TodoistTask> {
  return request<TodoistTask>("GET", `/tasks/${taskId}`);
}

export async function updateTask(
  taskId: string,
  update: TaskUpdate
): Promise<void> {
  await request<void>("POST", `/tasks/${taskId}`, update);
}

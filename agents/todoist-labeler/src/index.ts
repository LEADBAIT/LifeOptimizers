import { ask } from "@life-optimizers/llm";
import { updateTask, type TodoistTask } from "@life-optimizers/integrations";

export type { TodoistTask };

const CATCH_ALL_LABEL = "Reception";

const SYSTEM_PROMPT = `You are a task labeler for a personal productivity system.
Given a task title and description (may be in Hebrew, English, or mixed language), analyze the task's intent and assign relevant labels.

Return ONLY a valid JSON object with no additional text. Format:
{
  "labels": ["LabelName", ...],
  "reasoning": "Brief explanation of why these labels were chosen",
  "confidence": { "LabelName": 85, ... }
}

Rules:
- A task can have multiple labels
- Only include labels in "labels" that you are 60% or more confident about
- If NO labels reach 60% confidence, return an empty "labels" array — the system will handle the fallback
- Never include "Reception" in your response — that is handled by the caller
- Analyze intent, not just keywords — understand what the task IS, not just what words it contains
- Include ALL considered labels in the "confidence" object (even those below 60%)

Available labels and their descriptions:

**Redeemable** — Any accumulated value, benefit, or entitlement you should use before it's lost or expires: points, credits, coupons, vouchers, gift cards, loyalty rewards, cashback, miles, free trials, membership benefits, grants, mentorship programs, institutional support. Anything about using what you're entitled to.
Examples: "Check remaining 10,000-credit balance on Amazon", "Redeem CARLA CASH of $480", "$100 Coupon Duty Free", "Contact the Ogen Foundation to get business mentoring"

**Day Routines** — Recurring habits during waking hours. Daily rituals, health habits, supplements, exercise, hydration, spiritual practices, anything you do regularly as part of your day structure.
Examples: "💎 להניח תפילין בהודיה", "🧘🏿‍♂️ 15Min Meditation", "📝 15-Min Writing Session", "🙌 Call סבתוש"

**Night Routines** — Evening and bedtime habits. Wind-down rituals, sleep prep, pills, relaxation practices, next-day preparation.
Examples: "💊 Pills", "PRACTICE ENGLISH GRAMMER!", "🧘🏿‍♂️ 15Min Meditation", "📝 15-Min Writing Session"

**OnCauch** — Low-energy tasks for relaxed states. Things you can do while resting, from your phone, passive consumption, entertainment-adjacent, ordering stuff online, browsing. No focus required.
Examples: "Check The Whole Cloud", "Write in the notebook the story about the Arak bottle", "להזמין תחפושת לפורים מעלי", "למצוא בית להתארח בו לנוביגוד"

**NoComp** — Tasks away from the computer. Physical errands, phone calls, outside activities, real-world actions, anything requiring you to move or be offline, things done with phone only.
Examples: "💎 להניח תפילין בהודיה", "Print the families physical photo albums", "לחדש מרשם לבדיקת שומן לבבי", "IG Cleaning - Unfollowing MF"

**10X** — High-impact tasks that create significant results. Strategic moves, business-critical, life-changing potential, high leverage. If done, moves everything forward significantly.
Examples: "להתחיל לעבוד על החמרה במצב", "לבנות מנוע חיפוש AI לערוץ יוטיוב", "לעשות שינויי מיינדסט על כסף - cashflow"

**ToBuy** — Anything to purchase or order. Physical items, digital products, services, subscriptions, gifts. Shopping intent in any language.
Examples: "לקנות מרץ של 2פאק", "לקנות PIGGY BANK", "ספל אף חזיר", "buy chucky shit", "לקנות crest להלבנת שיניים", "Buy razor rojo"

**Neveloth** — Not important, not urgent, annoying tasks you keep postponing but should eventually do. Low motivation, easy to procrastinate, administrative nuisances, things you avoid.
Examples: "להוריד תפללה ביד", "לסדרר את הקודים של המזוודה", "לעשות גיבוי לווצאפ", "לעשות TSA PreCheck", "Fix add-ons bar on system gmail"

**Bookkeeping** — Financial administration. Invoices, receipts, expenses, Sumit entries, taxes, payments, refunds, bank transfers, subscriptions management, domain renewals, money paperwork, debts owed to you or by you.
Examples: "2-Month Bookkeeping", "להעביר 5000 לONEZERO", "לעשות הוראת קבע לקרן השתלמות", "פול חובה 1050 שח", "Handle the refund from Katamind"

**Car** — Tasks that can be done while driving or from the car. Listening to audio/video content, learning via podcasts or audiobooks, phone calls while driving, picking something up on the way.
Examples: "לראות את הקורס היי וייב קומיוניקיישן של טיילר", "ללמוד את הסרטון הזה של liquidity concepts", "לדבר עם שיר צילומים מערק", "🙌 Call סבתוש"

**Creative** — Generative and creative work. Design, writing, brainstorming, content creation, copywriting, ideation, strategy, anything requiring creative thinking.
Examples: "לעשות אפיון לעדות של 710עדות", "להכין פוסטים למערק", "לכתוב קופי לזריקות החדשות באפוס", "write liats whatsapp massages copy"

**Followup** — Waiting on something or someone. Need to chase, check status, ping again, await response, remind someone, verify something happened.
Examples: "לראות שקיבלנו את הכסף חזרה מנפש אחת", "Check on EZ Marketing for DAD", "לחזור לביטוח לאומי", "FOLLOWUP MODANRIANS", "Checkup on Linoy progress"

**10min** — Quick tasks, under 10 minutes. Easy wins, low effort, good for gaps between bigger work, fast to knock out.
Examples: "להעביר 5000 לONEZERO", "לשכפל מפתח לחדר", "לחדש מרשם", "Reset Dating Apps", "❤ COLD/WARM OURREACH"

**Brainless** — Zero thinking required. Mechanical, autopilot, mindless execution. Good when tired or multitasking. Cleaning, organizing, simple transfers, routine admin.
Examples: "להעביר 5000 לONEZERO", "Check The Whole Cloud", "Print the families physical photo albums", "📝 15-Min Writing Session"

**Bottleneck** — Blocking other work. Must be done first to unlock progress. Critical path, others depend on this, creates delays if not done.
Examples: "לשכפל מפתח לחדר", "Print the families physical photo albums", "💉 Blood Test", "Reset Dating Apps"

**Flights** — Tasks to do on long flights with your laptop. Deep work, learning, content consumption, planning, watching courses, research, writing. Good for flight time with PC.
Examples: "לשים התראות על הזדמנויות קנייה בשוק ההון ובקריפטו", "לעשות TSA PreCheck"

**Link** — Task contains or references a URL that needs attention. Something to read, watch, review, sign up, fill out, or act on online.
Examples: Tasks containing URLs to watch, read, fill forms, or review

**FamilyMatters** — Family-related. Parents, siblings, grandparents, relatives, family obligations, coordination, helping family members, home maintenance for family.
Examples: "Checkup on Linoy progress + Send Her Content", "להחליף פילטר מים בבית", "לקחת את אמא לבילוי", "להזמין את אלעד לגולף"

**Personal Optimization** — Self-improvement and life optimization. Systemizing your life, productivity tools, health, fitness, habits, learning, skill-building, personal growth, automation ideas for personal use, dating optimization, becoming better.
Examples: "CREATE INBOX ZERO FOR EMAIL", "להחליף סיסמאות חוזרות", "ללמוד מבטא אנגלית אמרקיאית", "search for ai agents", "optimize my internet profile pic"

**Assets** — Things you own that need attention. Investments, property, equipment, domains, accounts, valuable possessions, digital assets. Maintenance of what you have.
Examples: "Presstor.com"

**ToAutomate** — Ideas for automations you want to build. Future n8n workflows, agents, scripts, systems. Not tasks to do now, but automation concepts to implement later.
Examples: "pic of an gym machine + its lbs > doc notion", "myMusic Automations", "להקים אייג׳נט שמוצא כל פעם שיש פרסום על אירועים"`;

interface LabelAnalysis {
  labels: string[];
  reasoning: string;
  confidence: Record<string, number>;
}

function parseJsonResponse(raw: string): LabelAnalysis {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned) as LabelAnalysis;

  if (!Array.isArray(parsed.labels)) {
    throw new Error("Invalid response: 'labels' must be an array");
  }
  if (typeof parsed.reasoning !== "string") {
    throw new Error("Invalid response: 'reasoning' must be a string");
  }
  if (typeof parsed.confidence !== "object" || parsed.confidence === null) {
    throw new Error("Invalid response: 'confidence' must be an object");
  }

  return parsed;
}

async function analyzeLabels(
  title: string,
  description: string
): Promise<LabelAnalysis> {
  const userMessage = [
    `Task title: ${title}`,
    description ? `Task description: ${description}` : "",
    "",
    "Analyze this task and return your label assessment as JSON.",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const raw = await ask(userMessage, {
    system: SYSTEM_PROMPT,
    maxTokens: 800,
  });

  return parseJsonResponse(raw);
}

export async function labelTask(task: TodoistTask): Promise<void> {
  const analysis = await analyzeLabels(task.content, task.description);

  const qualifiedLabels = analysis.labels.filter(
    (label) => (analysis.confidence[label] ?? 0) >= 60
  );

  const labelsToApply =
    qualifiedLabels.length > 0 ? qualifiedLabels : [CATCH_ALL_LABEL];

  const update: { labels: string[]; due_string?: string } = {
    labels: labelsToApply,
  };

  if (!task.due) {
    update.due_string = "today";
  }

  await updateTask(task.id, update);

  console.log(
    `[todoist-labeler] Task "${task.content}" → labels: [${labelsToApply.join(", ")}]${update.due_string ? " | due: today" : ""}`
  );
  console.log(`[todoist-labeler] Reasoning: ${analysis.reasoning}`);
}

export const GET = async (req: Request) => {
  const { auth } = await import("@/lib/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  return toNextJsHandler(auth).GET(req);
};

export const POST = async (req: Request) => {
  const { auth } = await import("@/lib/auth");
  const { toNextJsHandler } = await import("better-auth/next-js");
  return toNextJsHandler(auth).POST(req);
};

export const dynamic = "force-dynamic";

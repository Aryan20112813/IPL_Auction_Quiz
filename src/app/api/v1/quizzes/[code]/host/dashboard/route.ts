import { NextRequest } from "next/server";
import { createHandler, successResponse } from "@/server/http/handler";
import { requireHost } from "@/server/auth/require-host";
import { getHostDashboard } from "@/server/services/quiz.service";
import { paginationSchema } from "@/lib/validation/pagination";

export const GET = createHandler(
  async (req: NextRequest, { params }: { params: { code: string } }) => {
    const quiz = await requireHost(req, params.code);

    const { searchParams } = new URL(req.url);
    const parsedPagination = paginationSchema.parse({
      limit: searchParams.get("limit") || 50,
      offset: searchParams.get("offset") || 0,
      sort: searchParams.get("sort") || "rank",
    });

    const dashboard = await getHostDashboard(
      quiz.id,
      parsedPagination.limit,
      parsedPagination.offset,
      parsedPagination.sort
    );

    return successResponse(dashboard, 200);
  }
);

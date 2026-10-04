import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";
import { ErrorCode } from "@/lib/constants";

export function successResponse<T extends Record<string, any>>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      ...data,
      serverTime: new Date().toISOString(),
    },
    { status }
  );
}

export function errorResponse(error: unknown) {
  const serverTime = new Date().toISOString();

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
        serverTime,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const issues = error.errors.map((e) => e.message).join(", ");
    return NextResponse.json(
      {
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: issues || "Invalid input shape or values",
        },
        serverTime,
      },
      { status: 400 }
    );
  }

  console.error("Unhandled API error:", error);

  return NextResponse.json(
    {
      error: {
        code: ErrorCode.INTERNAL,
        message: "An internal server error occurred",
      },
      serverTime,
    },
    { status: 500 }
  );
}

export function createHandler(
  handler: (req: NextRequest, params: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

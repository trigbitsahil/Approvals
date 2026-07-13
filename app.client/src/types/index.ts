import { NextRequest, NextResponse } from "next/server";

export type APIHandler = (
  req: Request | NextRequest,
  res: Response | NextResponse
) => Promise<NextResponse | void>;

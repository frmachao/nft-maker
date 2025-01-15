import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/server/utils"

export async function POST(request: NextRequest) {
  if (!request.body) {
    return NextResponse.json(
      { error: "No file uploaded" },
      { status: 400 }
    );
  }

  const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
  const MAX_SIZE = 1 * 1024 * 1024; // 1MB in bytes 

  if (contentLength > MAX_SIZE) {
    return NextResponse.json(
      { error: "File size too large. Maximum size is 1MB" },
      { status: 413 }
    );
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file)
    const url = await pinata.gateways.convert(uploadData.IpfsHash)
    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

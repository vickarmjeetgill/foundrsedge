import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/r2";
import { decrypt } from "@/lib/tokens";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate user using our session cookie
        const session = request.cookies.get("session")?.value;
        const decodedSession = await decrypt(session);
        if (!decodedSession || !decodedSession.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = decodedSession.userId as string;

        // 2. Parse the form data
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 3. Generate a unique file name to avoid collisions
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileExtension = file.name.split(".").pop();
        const uniqueFileName = `${userId}-${Date.now()}.${fileExtension}`;
        const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFileName}`;

        // 4. Upload to Cloudflare R2
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: uniqueFileName,
                Body: buffer,
                ContentType: file.type,
            })
        );

        // 5. Update user avatar in the database
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatarUrl: publicUrl
            },
        });

        // 6. Return the public URL of the uploaded file
        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}

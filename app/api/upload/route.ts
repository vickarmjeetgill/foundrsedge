import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
        const fileExtension = file.name.split(".").pop() || "png";
        const uniqueFileName = `${userId}-${Date.now()}.${fileExtension}`;

        // 4. Upload to Supabase Storage (avatars bucket)
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(uniqueFileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error("Supabase Storage error:", uploadError);
            return NextResponse.json({ error: "Storage upload failed: " + uploadError.message }, { status: 500 });
        }

        // 5. Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(uniqueFileName);

        const publicUrl = publicUrlData.publicUrl;

        // 6. Update user avatar in the database
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatarUrl: publicUrl
            },
        });

        // 7. Return the public URL of the uploaded file
        return NextResponse.json({ success: true, url: publicUrl });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
         if(!email || !password ) {
            return NextResponse.json(
                { error: "Email dan kata sandi wajib diisi"},
                { status: 400}
            );
         }

         
         // Cari penggguna berdasarkan email
         const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Akun Tidak Ditemukan"},
                { status: 401 }
            );
        }
        
        // verifikasi kesesuaian password
        const passwordMatch = await compare(password, user.password);
    
        if(!passwordMatch) {
            return NextResponse.json( 
             { error: "kata Sandi Salah"},
             { status: 401 },
            );
        }
    
        return NextResponse.json({
            message: "Login Berhasil",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

        } catch {
            return NextResponse.json(
                { error: "Gagal Memproses LOgin"},
                { status: 500 }
            );
          }
        }
    

"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
    const router = useRouter()
    //state input
    const [email,setemail] = useState("")
    const [password,setpassword] = useState("")
    const [ReCAPTCHAValue, setReCAPTCHAvalue] = useState<string |null>(null)

    //state eror
    const [error,seterror] = useState("")
    //handle sumbit from
    const handlesubmit = (e: React.FormEvent) => {
        e.preventDefault()

        //l. validasi required wajib diisi
        if(!email || !password) {
            seterror("email dan password wajib diisi")
            return
        }
        
        //2. validasi format email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(email)) {
            seterror("format email tidak valid")
            return;
        }

        //3. validasi panajang password
        if(password.length < 6) {
            seterror("password minimal 6 karakter")
            return;
        }

        //Validasi recapcha
        if(!ReCAPTCHAValue) {
            seterror("silahkan verifikasi ReCHAPTCHA")
            return;
        }

        //jika lolos
        seterror("");
        alert ("Registrasi Berhasil")
        router.push("/");
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg"> 
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">masuk akun</h1>
                    <p className="text-sm text-gray-500 mt-2">silahkan login untuk mengakses aplikasi</p>
                </div>
                {error && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handlesubmit} className="mt-6 space-y-4" noValidate> 
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukan email anda"
                        />
                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukan password anda"
                        />
                       
                </div>

                {/* tambhakan reCHAPTCHA disini */}
                <div className="flex justify-center pt-2">
                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(value) => setReCAPTCHAvalue(value)}
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Masuk Sekarang
                </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Belum punya akun {" "}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        daftar disini
                    </Link>
                </p>
            </div>         
        </div>
        )
}
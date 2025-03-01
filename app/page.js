'use client'

// import { useRouter } from "next/navigation";
import { redirect } from 'next/navigation';

export default function Home() {
  // const router = useRouter();
  redirect('/pokemon');
  return (
    <div> 

      </div>
  );
}

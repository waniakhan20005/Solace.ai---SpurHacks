import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[url('/background.png')] bg-cover bg-center min-h-screen">
      <h1 className="text-center text-3xl font-mono">Solace.ai</h1>
    </div>
  );
}

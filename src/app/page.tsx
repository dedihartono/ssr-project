import FileUpload from  "@/app/components/FileUpload";

// This is a Server Component by default
export default async function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <FileUpload></FileUpload>
    </main>
  );
}

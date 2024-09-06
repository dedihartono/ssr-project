import FilePreview from "@/app/components/FilePreview";

// This is a Server Component by default
export default async function PreviewDetail() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <FilePreview></FilePreview>
    </main>
  );
}

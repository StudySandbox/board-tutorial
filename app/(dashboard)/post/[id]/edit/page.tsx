import Image from "next/image";
import MainComponent from "./_components";

interface Props {
  params: Promise<{ id: string }>;
}

const EditPostPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <div className="flex h-screen flex-col">
      <header className="h-16 border-b py-2">
        <div className="text-primary mx-auto flex h-full max-w-2xl items-center gap-2 px-8 text-2xl font-bold">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          프롬프트 저장소
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl grow p-4">
        <MainComponent postId={id} />
      </main>
    </div>
  );
};

export default EditPostPage;
